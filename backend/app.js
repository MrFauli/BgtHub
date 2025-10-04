const express = require('express');
const app = express();
const posts = require('./posts.json');
const cors = require("cors");
console.log(`Start:`);

app.use(cors()); // sehr wichtig für lokale Entwicklung
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Weiter zur nächsten Middleware oder Route
});

app.get('/projects',(req,res,next)=>{
    res.send(posts);

})
app.post('/projects',(req,res,next)=>{
  const newBlog = req.body;
  console.log(newBlog)
  if(newBlog){
    posts.push(newBlog);
    res.status(201).send(newBlog);
  }
  else{
    res.status(400).send();
  }
})
app.get('/projects/tag/:tag',(req,res,next)=>{
  const filterTag = req.params.tag;
   const tagPosts = posts.filter((post)=>(post.tag.some(tag=> tag == filterTag) ));
   if(tagPosts){
    res.send(tagPosts);
   }
   else{
    res.status(404).send();
   }
})
app.get('/projects/id/:id',(req,res,next)=>{
  const id = req.params.id;
   const post = posts.find(p => p.id == id);
   if(post){
    res.send(post);
   }
   else{
    res.status(404).send();
   }
})

module.exports = {
    app
}