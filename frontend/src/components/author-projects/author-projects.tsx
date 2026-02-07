
import { Link,useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { postObj } from "../../types/posts";
import BackBtn from "../backBtn/backBtn";
import './author-projects.css';
import { API_URL } from "../../config";
function AuthorProjects(){
    const {author} = useParams();
        const [posts,setPosts] = useState<postObj[]>([]);
    useEffect(()=>{
        fetch(`${API_URL}/projects/author/${author}`)
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.log(err));
    },[]);
    const articles = posts.filter(p => p.author == author);
    const navigate = useNavigate();


    return(
        <div id="authorArticle" >
           <BackBtn onClick={()=>navigate(-1)}/>
            <h1>{author}</h1>
            {articles.map((article)=>(
                <h2 style={{color:'inherit',marginTop:"0",marginBottom:"0.5rem", textAlign:"left"}}><Link to={`/projekte/${article.slug}`}>{article.title}</Link></h2>
            ))}
        </div>
    )
}
export default AuthorProjects;