import React,{useEffect, useState,useRef} from 'react';
import  { defaultBlogPost, type postObj } from '../../types/posts';

import uploadIcon from '/assets/uploadIcon.png';
import './createBlog.css';
import CreateBlogContent, { type contentFuncs } from '../createBlogContent/createBlogContent';
import { useNavigate , useLocation,useParams} from "react-router-dom";

interface FormErrors {
  title: string;
  year: string;
  tags: string;
  summary:string;
  coverImage: string;
  content:string;
}
function CreateBlog(){
    const location = useLocation();
    const navigate = useNavigate();
    const [user,setUser] = useState ({name:"",grade:0,alumni:false});
    const [getUser,setGetUser] = useState(0);
    const blockRef = useRef<contentFuncs>(null);
    const [errors, setErrors] = useState<FormErrors>({
        title:"",
        year:"",
        tags: "",
        summary:"",
        coverImage:"",
        content:""
        });
    const {article} = useParams();
    const [title,setTitle] = useState("");

    const [tags,setTags] = useState<string[]>([]);
    const [year,setYear] = useState("");
    const [summary,setSummary] = useState("");
    const [cover, setCover] = useState<File|null>(null);
    const [oldBlog,setOldBlog] = useState<postObj>();
    const [checkedBlog,setCheckedBlock] =useState<boolean>();
    const [oldCover,setOldCover] = useState<File|null>();
    const checkAllowed = () =>{
            fetch("http://localhost:5000/user/data", {
            method: "GET",
            credentials: "include" 
            })
            .then(res => res.json())
            .then(data => {
            if(!data){
                setUser(prev => ({
                ...prev,
                name: ""
                }));
            }
            else{
                setUser(()=>({name: data.name,grade:data.grade,alumni:data.alumni}));
            }
                setGetUser(prev=>prev+1);
            })
            .catch(err => console.log(err));
    }
   const getMimeTypeFromFilename = (fileName:String) => {
  const extension = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      // Wichtig: Generischen Typ verwenden, falls unbekannt, aber idealerweise sollte dies nicht passieren.
      return 'application/octet-stream'; 
  }
};
    const urlToFile = async(url: string)=> {
        try{
    const response = await fetch(url);
    if (!response.ok) {
            console.error(`Fehler beim Laden der Bild-URL: ${response.status} ${response.statusText}`);
            // Hier könnten Sie einen leeren Blob oder null zurückgeben
            throw new Error('Fehler beim Abrufen der Bilddaten'); 
        }
    const blob = await response.blob();
   const filename = url.substring(url.lastIndexOf("/") + 1);

    const mimeType = getMimeTypeFromFilename(filename);

    const file = new File([blob], filename, { type: mimeType });
    return file;}
    catch(error){
        console.error("Fehler im urlToFile Prozess:", error);
        // Fehlerhaften oder leeren Blob zurückgeben
        return null;
    }
    }
    useEffect(()=>{
        checkAllowed();
        console.log(location.pathname);
       
        if( article && location.pathname.includes("/edit/")){
            fetch(`http://localhost:5000/user/article/${article}`, {
            method: "GET",
            credentials: "include" // wichtig für Cookies
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            if(data){
                setOldBlog(data);
            }
            
            })
            .catch(err => console.log(err));
            
        }

    },[]);
    useEffect(()=>{
        if(oldBlog){
            console.log("YEAH");
            setTitle(oldBlog.title);
            setTags(oldBlog.tag);
            setYear(oldBlog.date);
            setSummary(oldBlog.summary);
             const fileName = oldBlog.coverImage.replace("/^\/uploads\//", '');
                    urlToFile(fileName)
            urlToFile(fileName).then(setCover);
            console.log("OldCover");
            urlToFile(oldBlog.coverImage).then(setOldCover);
            console.log(oldBlog.coverImage);
            blockRef.current?.setContent(oldBlog.content);
        }
    },[oldBlog]);
    useEffect(()=>{
        console.log(oldCover);
    },[oldCover]);
    useEffect(()=>{
        if(getUser>0){
        if(user.name.length > 0){
            console.log(user);

        }
        else{
            navigate("/login");
        }
        }
    },[getUser])
    useEffect(()=>{
        console.log(tags);
    },tags);
    const handleSelectTags = (e: React.MouseEvent<HTMLSpanElement> | React.TouchEvent<HTMLSpanElement>) =>{
        
        const selected = e.currentTarget.textContent;
        if(!selected) return;
        setTags((prev)=> prev.includes(selected) ? prev.filter(tag => tag != selected):[...prev,selected]  );
    }
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCover(e.target.files[0]); // erste Datei
    } else {
      setCover(null); // nichts ausgewählt
      
    }
  }; 
  useEffect(()=>{
    if(checkedBlog){
    if(errors.title == "" &&  errors.tags == "" && errors.summary == "" && errors.year=="" && cover != null && blockRef.current?.getContent() != false && errors.content ==""){
            
            const newBlog = {...defaultBlogPost};
            newBlog.title = title;
            newBlog.slug = title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-"); 
            newBlog.author = user.name;
            newBlog.date = year;
            newBlog.grade = user.grade;
            newBlog.summary = summary;
            newBlog.tag = tags;
            newBlog.id = oldBlog ? oldBlog.id : 0;
            newBlog.coverImage = cover != null ?cover.name : "";
            newBlog.visible = true;
            let fileContent = null;
            const result  = blockRef.current?.getContent();
            if (result && typeof result !== "boolean") {
            const { content, files } = result;
            newBlog.content = content;
            fileContent = files;
                console.log(content, files);}
            
            console.log(newBlog);
            postBlog(newBlog,fileContent);
        }
    setCheckedBlock(false)}
  },[checkedBlog])
        const postBlog = async(blog:postObj,fileContent:File[] | null) =>{
            console.log("sssssssssssssssss");
        try{
            console.log(fileContent);
            console.log("filesss");
            const formData = new FormData();
            formData.append('article',JSON.stringify(blog));
            const newCoverName = cover?.name.replace(/^\d+-/, '');
            cover && formData.append('files',cover,newCoverName);
            fileContent && fileContent.forEach((newFile) => {
                const newName = newFile.name.replace(/^\d+-/, '');
                if(newFile)formData.append('files', newFile,newName);
                console.log(newFile);
                });
            console.log(`Cover: ${cover}`);

            fileContent && console.log(fileContent.length);
            console.log(formData);
            console.log(cover);
            console.log(fileContent);
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
                }
            if(oldBlog){

            const res = await fetch('http://localhost:5000/projects',{
                method:"PUT",
                
                credentials: "include",
                body:formData
            });
            const data = await res.json();
            console.log("Antwort: ",data);
            if(!data){
                return navigate("/login");
            }
            navigate(`/projekte/${blog.slug}`);
            }
            else{
                const res = await fetch('http://localhost:5000/projects',{
                method:"POST",
                
                credentials: "include",
                body:formData
            });

            const data = await res.json();
            console.log("Antwort: ",data);
            navigate(`/projekte/${blog.slug}`);
            }
            
            

        }
        catch(err){
            console.log(`Fehler: ` + err);
        }
    }
    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        setErrors({
        title:"",
        year:"",
        tags: "",
        summary:"",
        coverImage: "",
        content:""
        });
        checkAllowed();
        console.log(title);
        if(title.length == 0){
            setErrors((prev) => ({
                ...prev,
                 title: "Titel muss angegeben werden."
            }))
        }
        if(year.length == 0){
            console.log("yearrrrrrrrrrrrrrrr");
            setErrors((prev) => ({
                ...prev,
                 year: "Schuljahr des Projektes angeben."
            }))
        }
        // if(name.length == 0){
        //     setErrors((prev) => ({
        //         ...prev,
        //          name: "Dein Name fehlt."
        //     }))
        // }
        // if(grade.length == 0){
        //     setErrors((prev) => ({
        //         ...prev,
        //          grade: "Die Jahrgangsstufe während des Projektes."
        //     }))
        // }
        if(tags.length == 0){
            setErrors((prev) => ({
                ...prev,
                 tags: "Wähle mindestens ein Tag."
            }))
        }
        if(summary.length == 0){
            setErrors((prev) => ({
                ...prev,
                 summary: "Gib eine Zusammenfassung an."
            }))
        }
        else if(summary.length >= 120){
                        setErrors((prev) => ({
                ...prev,
                 summary: "Maximal 120 Zeichen."
            }))
        }
        if(cover == null){
                        setErrors((prev) => ({
                ...prev,
                 coverImage: "Lade ein Bild hoch."
            }))
        }
        else if(!cover.type.startsWith('image/')){
            setErrors((prev) => ({
                ...prev,
                 coverImage: "Bild muss .jpg, .png, .wepq oder .gif sein!"
            }))
            setCover(null);
        }
        const content =  blockRef.current?.getContent();+
        console.log("Hello");
        console.log(content);
        console.log(typeof(content));
        content && (typeof(content) !== "boolean") && console.log(content.content.length);
        if (content && typeof(content) !== "boolean" && content.content.length == 0) {
            console.log("yeag");
            setErrors((prev) => ({
                ...prev,
                 content: "Erstelle Inhalt."
            }))
        }                                 
        setCheckedBlock(true);
    }
    const deleteArticle = () =>{
        console.log("Löschen");
        if(oldBlog){
        fetch(`http://localhost:5000/projects/${oldBlog.id}`, {
            method: "DELETE",
            credentials: "include" // wichtig für Cookies
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                navigate("/dashboard");
            })
            .catch(err => console.log(err));
            
        }
    }
    return(
        <div id="createBlog">
            <form onSubmit={handleSubmit}>
            <h1>{oldBlog ? "Bearbeite ":"Veröffentliche "  }dein Projekt</h1>
            
            <label htmlFor='title' >Name deines Projektes</label>
            <input style={{borderColor: errors.title.length > 0 ?  "red" : ""}} type="text" name="title" id="title" placeholder="Mein Projekt" value={title} onChange={(e)=>setTitle(e.target.value)}/>
            {<span className="error">{errors.title}</span>}
            <label htmlFor='year'>Schuljahr des Projektes</label>
            <input style={{borderColor: errors.year.length > 0 ?  "red" : ""}} name="year" id="year" type="text" title="year" placeholder="2025/26" value={year} onChange={(e)=>setYear(e.target.value)}></input>
            {<span className="error">{errors.year}</span>}
            {/* <label htmlFor="name">Dein Name</label>
            <input style={{borderColor: errors.name.length > 0 ?  "red" : ""}} type="text" name="name" id="name" placeholder="Dein Name" value={name} onChange={(e)=>setName(e.target.value)}></input>
            {<span className="error">{errors.name}</span>}
            <label htmlFor="grade">Dein Jahrgang</label>
            <input style={{borderColor: errors.grade.length > 0 ?  "red" : ""}} type="number" name="grade" id="grade" placeholder="Dein Jahrgang" value={grade} onChange={(e)=>setGrade(e.target.value)}></input>
            {<span className="error">{errors.grade}</span>} */}
            <label htmlFor="select">Tags</label>
            <div style={{color: errors.tags.length > 0 ?  "red" : "inherit"}} id="select">
                <span style={{backgroundColor:"#e32185" }} className={`option ${tags.includes("Technik") ? "selected" : ""}`} onClick={handleSelectTags}>Technik</span>
                <span style={{backgroundColor:"#e48501" }} className={`option ${tags.includes("Informatik") ? "selected" : ""}`} onClick={handleSelectTags}>Informatik</span>
                <span style={{backgroundColor:"#4df444" }}className={`option ${tags.includes("Medien") ? "selected" : ""}`} onClick={handleSelectTags}>Medien</span>
            </div>
            {<span className="error">{errors.tags}</span>}
            <label style={{borderColor: errors.coverImage == ""? ""  : "red"}} id="uploadBox" htmlFor="coverImage">
            <input type="file"accept="image/jpeg, image/png, image/gif, image/webp" id="coverImage" name="coverImage" onChange={handleFileChange}  hidden/>
            <img style={{color:"green"}}src={uploadIcon} id="uploadIcon"/>
            <div id="uploadText">{cover == null ? "Coverbild hochladen" : "Zum ändern, neues Bild hochladen"}</div> 
            <div id="previewBox"></div>
            </label>
            {<span className="error">{errors.coverImage}</span>}
            <label  htmlFor="summary">Zusammenfassung</label>
           <textarea placeholder='Fasse deinen Artikel zusammen für die Preview...' style={{borderColor: errors.summary.length > 0 ?  "red" : ""}} rows={4} id="summary" name="summary" value={summary} onChange={(e)=>setSummary(e.target.value)} > 

           </textarea>
            {<span className="error">{summary.length > 120 ? "Maximal 120 Zeichen." : errors.summary}</span>}
            <div style={{    marginTop: "0.5rem",fontSize: "large",fontWeight:"bold" }}>
                Content vom Artikel: <br /> {title}
            <CreateBlogContent ref={blockRef}/>
            </div>
            {<span className="error">{errors.content}</span>}
            <div id="submitBtns">
                {oldBlog? <button  type="button" id="delete" onClick={deleteArticle}>Löschen</button>:""}
                <button id="upload" type="submit">{oldBlog? "Updaten" : "Veröffentlichen"}</button>
            </div>
            </form>
        </div>
    );
}

export default CreateBlog;