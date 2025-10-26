const express = require('express');
const app = express();
const uuid = require('uuid').v4;
const posts = require('./posts.json');
const cors = require("cors");
const Pool = require('pg').Pool;
const multer = require('multer');   
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const fs =  require('fs');
require('dotenv').config()

app.use(  cors({
    origin: "http://localhost:5173", // dein React-Frontend
    credentials: true, // <--- wichtig!
  })); // sehr wichtig für lokale Entwicklung


app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
app.use(

  session({
      genid: (req) => {
    console.log('Inside the session middleware')
    console.log(req.sessionID)
    return uuid() // use UUIDs for session IDs
  },

    secret: process.env.SESSION_SECRET ,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true nur bei HTTPS
      httpOnly: true,
      sameSite: "lax", // oder "none" falls cross-origin
    },
  })
);


const SALT_ROUNDS = 10;
const nodemailer = require('nodemailer');
const codeEmail=(code)=> {
  return `
  
    <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;">
      <table role="presentation" style="width:100%;border-collapse:collapse;">
        <tr>
          <td align="center" style="padding:40px 0;">
            <table role="presentation" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding:30px;text-align:center;">
                  <h1 style="font-size:24px;margin-bottom:16px;">Hey du da 👋</h1>
                  <p style="font-size:16px;line-height:1.5;margin:0 0 20px 0;">
                    Hier ist dein Anmeldecode für das <b>BGT-Hub</b>:
                  </p>
                  <div style="background:#9fc245;color:#ffffff;padding:20px;font-size:32px;font-weight:bold;letter-spacing:4px;border-radius:8px;display:inline-block;margin-bottom:30px;">
                    ${code}
                  </div>
                  <p style="font-size:14px;color:#555;line-height:1.5;">
                    Falls du die E-Mail nicht beantragt hast, ignoriere sie!
                    Bei Fragen oder Problemen, schreib gerne eine E-Mail!
                    <br><br>
                    Beste Grüße,<br>
                    dein <b>BGT-Hub Team</b> 🚀
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  `;
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "techsloth.info@gmail.com",
    pass:  process.env.EMAIL_PASS, // nicht dein normales Passwort!
  },
});
// 📁 Absoluter Pfad zum Ordner "frontend/public/assets"
const assetsPath = path.resolve(__dirname, "../frontend/public/assets");

const { types } = require('pg');
types.setTypeParser(20, val => parseInt(val, 10));
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'bgtHub',
  password: process.env.DB_PASS,
  port: 5432,
})
console.log(`Start:`);
// 🟡 Speicherort + Dateiname festlegen
const storage = multer.diskStorage({
  destination: path.join(assetsPath, ""),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.use("/assets", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Weiter zur nächsten Middleware oder Route
});

passport.serializeUser((user, done) => {
  console.log("Hat geklappt: ");
  console.log(user.email);

  done(null, user.email);
  
});
passport.deserializeUser((email,done)=>{
  pool.query(`SELECT * FROM authors
                WHERE email = $1;`,[email],(error,result)=>{
                  if(error) return done(error);
                  console.log(result.rows[0]);
                  done(null,result.rows[0]);
                })


});
function ensureAuthenticated(req, res, next) {
  console.log(req.session);
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).send(false);
  }
}
passport.use(new LocalStrategy( {
      usernameField: "email", // sagt Passport, nimm req.body.email
      passwordField: "password", // sagt Passport, nimm req.body.password
    },
  function(email, password, done) {
     pool.query(`SELECT * FROM authors
              WHERE email = $1;`,[email],async(error,result)=>{
                if(error){
                  return done(err);
                }
                if(!result.rows[0]) return done(null,false);
                const passwordCorrect = await bcrypt.compare(password,result.rows[0].password);
                console.log(passwordCorrect);
                if(!passwordCorrect){
                  return done(null,false);
                }
                else{
                    return done(null,result.rows[0]);
                }
              })
    
  }
));
app.use(passport.initialize());
app.use(passport.session());
const getProjects = (req,res,next) =>{

  
  pool.query(
    `SELECT p.id AS id, p.title AS title, p.slug AS slug, p.date AS date, 
    a.grade AS grade, a.name AS author, p.tag AS tag, p.summary AS summary, 
    p.cover_img AS "coverImage", p.content AS content, p.visible AS visible
    FROM posts p
    LEFT JOIN posts_authors pa ON pa.blog_id = p.id
    LEFT JOIN authors a ON a.email = pa.author_email
    ORDER BY id ASC;`,(error,results)=>{
    if(error){
      
      res.status(400).send();
      throw error;
    }
    
    res.status(200).send(results.rows);
  });
}
app.get('/projects',getProjects);

app.post('/projects',ensureAuthenticated,upload.array('files'),async(req,res,next)=>{
  console.log(req.body);
  const newBlog = JSON.parse(req.body.article);
  console.log(newBlog.content);
  newBlog.coverImage = '/assets/'+req.files[0]?.filename;
  console.log(req.file);
  const email = req.session.passport.user;
  console.log(email);
  let index = 1;
  newBlog.content.map((el)=>{
    if(el.type == "image"){
      el.src ='/assets/'+ req.files[index]?.filename;
      index++;
    }
  })
  if(newBlog){
   let blogResult;
    console.log(newBlog);
     pool.query(`INSERT INTO posts(title,slug,date,tag,summary,cover_img,content,visible)
      VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *`,
      [newBlog.title,newBlog.slug,newBlog.date,newBlog.tag,newBlog.summary,newBlog.coverImage,JSON.stringify(newBlog.content),newBlog.visible]
    ,(error,results)=>{
      if(error){
            res.status(400).send();
            throw error;
      }
      
      blogResult = results.rows[0];
      console.log(blogResult);
      pool.query(`INSERT INTO posts_authors(blog_id,author_email)
      VALUES ($1,$2) RETURNING *`,
      [blogResult.id,email],(error,results)=>{
        if(error){
           res.status(400).send();
            throw error;
            
        }
        console.log(results.rows);
        res.status(201).send(blogResult);
      })
    })

    }
    else{
      res.status(400).send();
    }
});
app.put('/projects',ensureAuthenticated,upload.array('files'),async(req,res,next)=>{
    console.log(req.body);
    console.log("body");
  const newBlog = JSON.parse(req.body.article);
  console.log(newBlog.content);
  newBlog.coverImage = '/assets/'+req.files[0]?.filename;
  console.log(req.file);
  const email = req.session.passport.user;
  console.log(email);
  let index = 1;
  newBlog.content.map((el)=>{
    if(el.type == "image"){
      el.src ='/assets/'+ req.files[index]?.filename;
      index++;
    }
  })
  let oldBlog = await pool.query('SELECT content, cover_img FROM posts WHERE id = $1',[newBlog.id]);
  oldBlog = oldBlog.rows[0];
  let oldImages = [];
  console.log(oldBlog);
  console.log(oldBlog.content);
  oldBlog.content.forEach((el)=>{
    if(el.type == "image") oldImages.push(el.src);
  })
  oldImages.push(oldBlog.cover_img);
  console.log(oldImages);
  pool.query(`UPDATE posts
              SET title = $1, slug = $2, date = $3, tag = $4, summary = $5, cover_img = $6, content = $7, visible = $8
              WHERE id = $9`,
            [newBlog.title,newBlog.slug,newBlog.date,newBlog.tag,newBlog.summary,newBlog.coverImage,JSON.stringify(newBlog.content),newBlog.visible,newBlog.id],
          (error,result)=>{
             if(error){
           res.status(400).send();
            throw error;
            
        }
            console.log(result.rows[0]);
            console.log("Updated");
            oldImages.forEach((imgPath) => {
            const fullPath = path.join('../frontend/public',imgPath);
            console.log(fullPath);
            fs.unlink(fullPath, (err) => {
              if (err) console.warn("❌ Bild konnte nicht gelöscht werden:", imgPath, err.message);
              else console.log("🗑️ Gelöscht:", imgPath);
            });
          });
            res.status(200).send(true);
          })
})
app.delete('/projects/:id',ensureAuthenticated,(req,res,next)=>{
  const id = req.params.id;
  const email = req.session.passport.user;
  pool.query(`SELECT author_email FROM posts_authors
              WHERE blog_id = $1;`,[id],(error,result)=>{
                 if(error){
           res.status(400).send();
            throw error;
        }       let author_email = result.rows[0];
                if(author_email.author_email != email){
                  return res.status(400).send(false);
                }
                console.log(id);
                pool.query(`DELETE FROM posts
                            WHERE id = $1;`,[id],(error,result)=>{
                              if(error){
                                res.status(400).send();
                                  throw error;
                              }
                              res.status(200).send(true);
                            })
              })
})

app.get('/projects/tag/',(req,res,next)=>{
  const filterTag = req.query.tag;
  console.log("OIN");
  console.log(filterTag);
  console.log("yeah");

  if(!filterTag){
   getProjects(req,res,next);
   return;
  }
  else{
  console.log(filterTag);
    pool.query(
    `SELECT p.id AS id, p.title AS title, p.slug AS slug, p.date AS date, 
    a.grade AS grade, a.name AS author, p.tag AS tag, p.summary AS summary, 
    p.cover_img AS "coverImage", p.content AS content,p.visible AS visible
    FROM posts p
    LEFT JOIN posts_authors pa ON pa.blog_id = p.id
    LEFT JOIN authors a ON a.email = pa.author_email
    WHERE $1 = ANY(p.tag)
    ORDER BY id ASC;`,[filterTag],(error,results)=>{
    if(error){
      
      res.status(400).send();
      throw error;
    }
    
    res.status(200).send(results.rows);
    console.log( typeof(results.rows[0].id));

    console.log(results.rows);
  });}

})
app.get('/projects/author/:author',(req,res,next)=>{
  const author = req.params.author;
    console.log(author);
    console.log("Moin");
    pool.query(
    `SELECT p.id AS id, p.title AS title, p.slug AS slug, p.date AS date, 
    a.grade AS grade, a.name AS author, p.tag AS tag, p.summary AS summary, 
    p.cover_img AS "coverImage", p.content AS content,p.visible AS visible
    FROM posts p
    LEFT JOIN posts_authors pa ON pa.blog_id = p.id
    LEFT JOIN authors a ON a.email = pa.author_email
    WHERE $1 = a.name
    ORDER BY id ASC;`,[author],(error,results)=>{
    if(error){
      
      res.status(400).send();
      throw error;
    }
    
    res.status(200).send(results.rows);
    console.log( typeof(results.rows[0].id));

    console.log(results.rows);
  });
})

// app.get('/projects/id/:id',(req,res,next)=>{
//   const id = req.params.id;
//    const post = posts.find(p => p.id == id);
//    if(post){
//     res.send(post);
//    }
//    else{
//     res.status(404).send();
//    }
// })
app.get('/user/article/:slug',ensureAuthenticated,(req,res,next)=>{
  const slug = req.params.slug
  pool.query(
    `SELECT p.id AS id, p.title AS title, p.slug AS slug, p.date AS date, 
    a.grade AS grade, a.name AS author, p.tag AS tag, p.summary AS summary, 
    p.cover_img AS "coverImage", p.content AS content, p.visible AS visible
    FROM posts p
    LEFT JOIN posts_authors pa ON pa.blog_id = p.id
    LEFT JOIN authors a ON a.email = pa.author_email
    WHERE p.slug = $1
    ORDER BY id ASC;`,[slug],(error,results)=>{
    if(error){
      
      res.status(400).send();
      throw error;
    }
   
    const blog = results.rows[0];
     if(!blog){
      return res.status(400).send(false);
    }
    console.log(blog);
    pool.query('SELECT author_email FROM posts_authors WHERE blog_id = $1;',[blog.id],(err,result)=>{
    if(err){
      res.status(400).send();
      throw err;
    }
    console.log("article:");
    console.log(blog);
    console.log(result.rows[0]);
    if(result.rows[0].author_email != req.session.passport.user){
      return res.status(401).send();
    }
    res.status(200).send(blog)
  });})
})
app.get('/user/email/:email',(req,res,next)=>{
  const email = req.params.email;
  console.log(email);

  pool.query('SELECT * FROM authors WHERE authors.email = $1',[email],(error,result)=>{
    if(error){
      res.status(400).send();
      throw error;
    }
    if(result.rows.length > 0){
      console.log(true);
        res.status(200).send(true);
    }
    else{
      console.log(false);
        res.status(200).send(false);
    }
  
  })
})
app.get('/user/authcode/:email',async(req,res,next)=>{
  console.log(req.params.email);
  const code = Math.floor(100000 + Math.random() * 900000);
  try{
    const info = await transporter.sendMail({
    from: '"BGT-HUB" <techsloth.info@gmail.com>',
    to:'gianlucacar.rossi@bbs-me.org',
    subject: "Dein Bestätigungscode 🔐",
    text: `Dein Code lautet: ${code}`,
    html: codeEmail(code),
  });
  
  console.log("✅ Mail gesendet:", info.messageId);
    res.status(200).send(code);
  } catch (error) {
    console.error("❌ Fehler beim Senden der E-Mail:", error);
    res.status(400).send(error.message);
  }


});

app.post('/user/login/',(req,res,next) =>{passport.authenticate("local",(err,user,info)=>{
  console.log(user);
    console.log('Inside the homepage callback function')
  console.log(req.sessionID)
  if(err) return res.status(400).send(err);

  if(!user){
    
    return res.status(401).send(false);}
  
   req.login(user, (err) => {
      if (err) return next(err);
            console.log('Inside req.login() callback')
      console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user: ${JSON.stringify(req.user)}`)
      console.log("eingeloggt");
      return res.status(200).send(true);
    });

})(req, res, next)});
app.post('/user/register/',async(req,res,next)=>{
  const body = req.body;
  console.log(body);
 const hash = await bcrypt.hash(body.password, SALT_ROUNDS);
 pool.query(`INSERT INTO authors(name,email,grade,alumni,password)
            VALUES($1,$2,$3,$4,$5)`,[body.name,body.email,body.grade,false,hash],(error,result)=>{
              if(error){
                res.status(400).send();
                throw error;
              }
              res.status(201).send(result.rows[0]);
            })
 
});
app.get('/user/articles',ensureAuthenticated,(req,res,next)=>{
  const userEmail  = req.session.passport.user;
   pool.query(
    `SELECT p.id AS id, p.title AS title, p.slug AS slug, p.date AS date, 
    a.grade AS grade, a.name AS author, p.tag AS tag, p.summary AS summary, 
    p.cover_img AS "coverImage", p.content AS content,p.visible AS visible
    FROM posts p
    LEFT JOIN posts_authors pa ON pa.blog_id = p.id
    LEFT JOIN authors a ON a.email = pa.author_email
    WHERE $1 = a.email
    ORDER BY id ASC;`,[userEmail],(error,results)=>{
    if(error){
      
      res.status(400).send();
      throw error;
    }
    
    res.status(200).json({result : results.rows,accept:true});
    

    console.log(results.rows);
  });
});
app.get('/user/data',ensureAuthenticated,(req,res,next)=>{
  const userEmail = req.session.passport.user;
  pool.query('SELECT * FROM authors WHERE email = $1',[userEmail],(error,result)=>{
    if(error){
      res.status(400).send();
      throw error;
    }
    console.log(result.rows[0]);
    res.status(200).send(result.rows[0]);
  })
})
app.get('/user/logedin',ensureAuthenticated,(req,res,next)=>{
  res.status(200).send(true);
})
app.post('/user/articles/togglevisible',ensureAuthenticated,(req,res,next)=>{
  
  const id = req.body.id;
  pool.query('SELECT author_email FROM posts_authors WHERE blog_id = $1;',[id],(err,result)=>{
    if(err){
      res.status(400).send();
      throw err;
    }
    console.log("article:");
    console.log(result.rows[0]);
    if(result.rows[0].author_email != req.session.passport.user){
      return res.redirect('/user/articles');
    }
    pool.query(`UPDATE posts 
                SET visible = NOT visible
                WHERE id = $1`,[id],(err,result2)=>{
                  if(err){
                    res.status(400).send();
                    throw err;
                  }
                  console.log(result2.rows[0]);
                  console.log("Changed");
                  res.redirect('/user/articles');
                })
  })

})
app.get("/user/logout/", ensureAuthenticated, (req, res) => {
  
req.logout(function(err) {
  if (err) { return next(err); }
  console.log("lougout");
    req.session.destroy(err => {
    if (err) {
      console.error("Fehler beim Session-Löschen:", err);
      return res.status(500).send("Logout fehlgeschlagen");
    }

    // Cookie im Browser löschen
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "None",
      secure: true // bei HTTPS true, sonst false
    });

    res.status(200).send("Logout erfolgreich");})
});
});
module.exports = {
    app
}