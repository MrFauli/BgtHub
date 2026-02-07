import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ActionBtn from "../actionbtn/actionbtn";
import { type postObj } from "../../types/posts";
import "./adminPortal.css";
import { API_URL } from "../../config";

function AdminPortal(){

        const [admin,setAdmin] = useState();

        const [getAdmin,setGetAdmin] = useState(0);
        const [alumniMail,setAlumniMail] = useState<string>("");
        const [alumniError,setAlumniError] = useState("");
        const [existEmail, setExistEmail] = useState();
        const [successMail,setSuccessMail] = useState(false);
        const [emailTrigger,setEmailTrigger] = useState(0);
        const [articles,setArticles] = useState<postObj[]>([]);
        const navigate = useNavigate();
        useEffect(()=>{
            fetch(`${API_URL}/user/articles`, {
            method: "GET",
            credentials: "include" // wichtig für Cookies
            })
            .then(res => res.json())
            .then(data => {
            if(data)
               {

                setAdmin(data.admin_rechte);
                console.log("admin:"+data.admin_rechte)
                console.log(data)
               }
            setGetAdmin(prev => prev+1);
            fetch(`${API_URL}/projects`, {
            method: "GET",
            credentials: "include" // wichtig für Cookies
            })
            .then(res => res.json())
            .then(data => {
            if(!data){
                setArticles([]);
            }
            else{
                setArticles(data);
            }
                
            })
            })
            .catch(err => console.log(err));    },[])
        useEffect(()=>{
            if(getAdmin>0){
            if(!admin){
                navigate("/dashboard")
            }
            else{
                
            }}
        })
            const logout = () =>{
        fetch(`${API_URL}/user/logout/`,{
                method:"GET",
                credentials: "include"
               })
            .then(data => {
                console.log(data);
                navigate("/");
            });}
        const inviteAlumni = () =>{
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if(regex.test(alumniMail)){
                 fetch(`${API_URL}/user/email/${alumniMail}`)
            .then(res => res.json())
            .then(data => {
              console.log("DATA:", data);
              setExistEmail(data.status);
              setEmailTrigger((prev)=>prev+1);
            })
            .catch(err => console.error("FEHLER:", err));
            }
            else{
                setAlumniError("Bitte gültige E-Mail hinzufügen"); 
            }
        }
        useEffect(()=>{
            console.log(emailTrigger);
            if(emailTrigger>0){
            if(!existEmail && alumniMail.length > 0){
                setAlumniError("");
                fetch(`${API_URL}/user/invite/${alumniMail}`,{method:"POST",credentials: "include"})
                .then(data=>{
                    if(data.status == 200){
                        setAlumniMail("");
                        setSuccessMail(true);
                        setTimeout(()=>setSuccessMail(false),2000);
                    }
                }
                )
            }
            else{
                setAlumniError("Mail hat bereits ein Konto!");
            }}
        },[emailTrigger])
        const changeVisible = (id:number)=>{
        console.log(id);
            fetch(`${API_URL}/user/articles/togglevisible`,{
                method:"POST",
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json", 
                },
                body:JSON.stringify({
                    id: id
                })})
            .then(res => res.json())
            .then(data => {
            if(!data){
                setArticles([]);
            }       
            else{
               {
            fetch(`${API_URL}/projects`, {
            method: "GET",
            credentials: "include" // wichtig für Cookies
            })
            .then(res => res.json())
            .then(data => {
            if(!data){
                setArticles([]);
            }
            else{
                setArticles(data);
            }})

               }
            }
            })
            .catch(err => console.log(err));
    }
     const deleteArticle = (id:number) =>{
        
        fetch(`${API_URL}/projects/${id}`, {
            method: "DELETE",
            credentials: "include" // wichtig für Cookies
            })
            .then(res => res.json())
            .then(() => {
                 fetch(`${API_URL}/projects`, {
            method: "GET",
            credentials: "include" // wichtig für Cookies
            })
            .then(res => res.json())
            .then(data => {
            if(!data){
                setArticles([]);
            }
            else{
                setArticles(data);
            }}) 
            })
            .catch(err => console.log(err));
            
        }
    
    return(
        <>
          {admin &&<div id="adminPortal">
             <div id="btns">
            <ActionBtn onClick={logout} id="logout" color="red"><img className="icon" src="/assets/logout.png"/></ActionBtn>   
            <ActionBtn onClick={()=>navigate("/dashboard")} id="dashboard-btn" color="blue"><img className="icon" src="/assets/edit.png"/></ActionBtn>
            </div>
            <h1>Admin Portal</h1>
            <h2>Alumni hinzufügen</h2>
            <div id="alumniRow"><input type="email" placeholder="name@email.com" value={alumniMail} onChange={(e)=>setAlumniMail(e.target.value)}/>
            <ActionBtn onClick={inviteAlumni} color="#b4b4b4" id="sendMail" className={successMail?"button-success":""}><img className="icon" src="/assets/send.png"/></ActionBtn></div>
            <span className="error">{alumniError}</span>
             {articles  && articles.map((article)=>(
            <div className="articleBox">
            <h3>{<Link to={`/projekte/${article.slug}`} >{article.title}</Link>}</h3>
            
                
                <button onClick={()=>changeVisible(article.id)}><img className="icon" src={article.visible ? "/assets/visible.png" : "/assets/notVisible.png"} alt="visible" /></button>
                <button onClick={()=>deleteArticle(article.id)}><img className="icon" src="/assets/delete.png" alt="delete" /></button>
            </div>

        ))}
          </div>  }

        </>
    );
}

export default AdminPortal;