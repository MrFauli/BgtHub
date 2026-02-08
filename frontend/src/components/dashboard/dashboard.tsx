import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { type postObj } from "../../types/posts";
import './dashboard.css';
import { API_URL } from '../../config.ts';
import ActionBtn from "../actionbtn/actionbtn";
function Dashboard(){
    const navigate = useNavigate();
    const [user,setUser] =useState<postObj[]>([]);
    const [admin,setAdmin] = useState();
    const [logedIn,setLogedIn] = useState<boolean>();
    const [getUser,setGetUser] = useState<number>(0);
    useEffect(()=>{
            fetch(`${API_URL}/user/articles`, {
            method: "GET",
            credentials: "include" // wichtig für Cookies
            })
            .then(res => res.json())
            .then(data => {
            if(!data){
                setUser([]);
            }
            else{
               {setLogedIn(data.accept); 
                setUser(data.result);
                setAdmin(data.admin_rechte);
                console.log("admin:"+data.admin_rechte)
                console.log(data)
               }
            }
                setGetUser(prev=>prev+1);
            })
            .catch(err => console.log(err));

       

    },[])
    useEffect(()=>{
        console.log(getUser);
        console.log("admin"+admin)
        if(getUser>0){
            console.log(user);
        if(logedIn){
            console.log(user);
            console.log("Welcome");
        }
        else{
            navigate("/login");
        }}
    },[getUser])
    const changeVisible = (id:number)=>{
        console.log(id);
            fetch(`${API_URL}/user/articles/togglevisible`,{
                method:"POST",
                credentials: "include", // wichtig für Cookies
                headers: {
                    "Content-Type": "application/json", 
                },
                body:JSON.stringify({
                    id: id
                })})
            .then(res => res.json())
            .then(data => {
            if(!data){
                setUser([]);
            }
            else{
               {setLogedIn(data.accept); 
                setUser(data.result);

               }
            }
                setGetUser(prev=>prev+1);
            })
            .catch(err => console.log(err));
    }
    const logout = () =>{
        fetch(`${API_URL}/user/logout/`,{
                method:"GET",
                credentials: "include"
               })
            .then(data => {
                console.log(data);
                navigate("/");
            });
    }
    return(

          <>
          {logedIn &&
            <div id="dashboard">
                <div id="btns">
            <ActionBtn onClick={logout} id="logout" color="red"><img className="icon" src="/assets/logout.png"/></ActionBtn>   
            {admin &&<ActionBtn onClick={()=>navigate("/admin")} id="admin" color="green"><img className="icon" src="/assets/admin.png"/></ActionBtn>}
         </div> 

        <h1>Deine Projekte</h1>
        
        {user  && user.map((article)=>(
            <div className="articleBox">
            <h3>{<Link to={`/projekte/${article.slug}`} >{article.title}</Link>}</h3>
            
                <Link to={`/dashboard/edit/${article.slug}`}><button ><img className="icon" src="/assets/edit.png" alt="edit" /></button></Link>
                <button onClick={()=>changeVisible(article.id)}><img className="icon" src={article.visible ? "/assets/visible.png" : "/assets/notVisible.png"} alt="visible" /></button>
            
            </div>

        ))}
        <Link to="/dashboard/create">
        <ActionBtn id="createBtn" color="#adbf00">Neues Projekt</ActionBtn>
        </Link>
        
        </div> }</>)}

export default Dashboard;