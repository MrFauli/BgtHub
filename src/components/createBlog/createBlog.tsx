import React,{useEffect, useState,useRef} from 'react';
import  { defaultBlogPost } from '../../types/posts';

import uploadIcon from '/assets/uploadIcon.png';
import './createBlog.css';
import type { ContentBlock } from '../../types/content';
import CreateBlogContent, { type contentFuncs } from '../createBlogContent/createBlogContent';
import Posts from '../../posts.json';

interface FormErrors {
  title: string;
  year: string;
  name: string;
  grade:string;
  tags: string;
  summary:string;
  coverImage: string;
}
function CreateBlog(){
    const blockRef = useRef<contentFuncs>(null);
    const [errors, setErrors] = useState<FormErrors>({
        title:"",
        year:"",
        name:"",
        grade:"",
        tags: "",
        summary:"",
        coverImage:""

        });
    const [title,setTitle] = useState("");
    const [name,setName] = useState("");
    const [grade,setGrade] = useState("");
    const [tags,setTags] = useState<string[]>([]);
    const [year,setYear] = useState("");
    const [summary,setSummary] = useState("");
    const [cover, setCover] = useState<File|null>(null);
    
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

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        setErrors({
        title:"",
        year:"",
        name:"",
        grade:"",
        tags: "",
        summary:"",
        coverImage: ""
        })
        console.log(title);
        if(title.length == 0){
            setErrors((prev) => ({
                ...prev,
                 title: "Titel muss angegeben werden."
            }))
        }
        if(year.length == 0){
            setErrors((prev) => ({
                ...prev,
                 year: "Schuljahr des Projektes angeben."
            }))
        }
        if(name.length == 0){
            setErrors((prev) => ({
                ...prev,
                 name: "Dein Name fehlt."
            }))
        }
        if(grade.length == 0){
            setErrors((prev) => ({
                ...prev,
                 grade: "Die Jahrgangsstufe während des Projektes."
            }))
        }
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
        blockRef.current?.getContent();
        console.log()
        if(errors.title == "" && errors.name == "" && errors.grade == "" && errors.tags == "" && errors.summary == "" && cover != null && blockRef.current?.getContent() != false){
            
            const newBlog = {...defaultBlogPost};
            newBlog.title = title;
            newBlog.slug = title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-"); 
            newBlog.author = name;
            newBlog.date = year;
            newBlog.grade = grade;
            newBlog.summary = summary;
            newBlog.tag = tags;
            newBlog.id = Posts.length +1;
            newBlog.coverImage = cover != null ?cover.name : "";
            newBlog.content = blockRef.current?.getContent() as ContentBlock[];
            console.log(newBlog);
        }
    }

    return(
        <div id="createBlog">
            <form onSubmit={handleSubmit}>
            <h1>Veröffentliche dein Projekt</h1>
            
            <label htmlFor='title' >Name deines Projektes</label>
            <input style={{borderColor: errors.title.length > 0 ?  "red" : ""}} type="text" name="title" id="title" placeholder="Mein Projekt" value={title} onChange={(e)=>setTitle(e.target.value)}/>
            {<span className="error">{errors.title}</span>}
            <label htmlFor='year'>Schuljahr des Projektes</label>
            <input style={{borderColor: errors.year.length > 0 ?  "red" : ""}} name="year" id="year" type="text" title="year" placeholder="2025/26" value={year} onChange={(e)=>setYear(e.target.value)}></input>
            {<span className="error">{errors.year}</span>}
            <label htmlFor="name">Dein Name</label>
            <input style={{borderColor: errors.name.length > 0 ?  "red" : ""}} type="text" name="name" id="name" placeholder="Dein Name" value={name} onChange={(e)=>setName(e.target.value)}></input>
            {<span className="error">{errors.name}</span>}
            <label htmlFor="grade">Dein Jahrgang</label>
            <input style={{borderColor: errors.grade.length > 0 ?  "red" : ""}} type="number" name="grade" id="grade" placeholder="Dein Jahrgang" value={grade} onChange={(e)=>setGrade(e.target.value)}></input>
            {<span className="error">{errors.grade}</span>}
            <label htmlFor="select">Tags</label>
            <div style={{color: errors.tags.length > 0 ?  "red" : ""}} id="select">
                <span style={{backgroundColor:"#e32185" }} className={`option ${tags.includes("Technik") ? "selected" : ""}`} onClick={handleSelectTags}>Technik</span>
                <span style={{backgroundColor:"#e48501" }} className={`option ${tags.includes("Informatik") ? "selected" : ""}`} onClick={handleSelectTags}>Informatik</span>
                <span style={{backgroundColor:"#4df444" }}className={`option ${tags.includes("Medien") ? "selected" : ""}`} onClick={handleSelectTags}>Medien</span>
            </div>
            {<span className="error">{errors.tags}</span>}
            <label style={{borderColor: errors.coverImage == ""? ""  : "red"}} id="uploadBox" htmlFor="coverImage">
            <input type="file" id="coverImage" name="coverImage" accept='image/*'onChange={handleFileChange}  hidden/>
            <img style={{color:"green"}}src={uploadIcon} id="uploadIcon"/>
            <div id="uploadText">{cover == null ? "Coverbild hochladen" : "Zum ändern, neues Bild hochladen"}</div> 
            <div id="previewBox"></div>
            </label>
            {<span className="error">{errors.coverImage}</span>}
            <label  htmlFor="summary">Zusammenfassung</label>
           <textarea placeholder='Fasse deinen Artikel zusammen für die Preview...' style={{borderColor: errors.summary.length > 0 ?  "red" : ""}} rows={4} id="summary" name="summary" value={summary} onChange={(e)=>setSummary(e.target.value)} > 

           </textarea>
            {<span className="error">{summary.length > 120 ? "Maximal 120 Zeichen." : errors.summary}</span>}
            <label>Content vom Artikel
            <CreateBlogContent ref={blockRef}/>
            </label>
            <button id="upload" type="submit">Veröffentlichen</button>
            </form>
        </div>
    );
}

export default CreateBlog;