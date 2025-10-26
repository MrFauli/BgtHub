
import { Link,useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { postObj } from "../../types/posts";
import BackBtn from "../backBtn/backBtn";

function AuthorProjects(){
    const {author} = useParams();
        const [posts,setPosts] = useState<postObj[]>([]);
    useEffect(()=>{
        fetch(`http://localhost:5000/projects/author/${author}`)
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.log(err));
    },[]);
    const articles = posts.filter(p => p.author == author);
    const navigate = useNavigate();


    return(
        <div style={{ position: 'relative', width: '100%', paddingTop:'5%',color:'inherit'}} >
           <BackBtn onClick={()=>navigate(-1)}/>
            {articles.map((article)=>(
                <h1 style={{color:'inherit'}}><Link to={`/projekte/${article.slug}`}>{article.title}</Link></h1>
            ))}
        </div>
    )
}
export default AuthorProjects;