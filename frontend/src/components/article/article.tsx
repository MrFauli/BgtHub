import {useEffect,useState} from "react";
import type {postObj} from '../../types/posts';
import type {ContentBlock} from '../../types/content';
import { Link,useParams,useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import Tag from "../tag/tag";
import './article.css';
import BackBtn from "../backBtn/backBtn";

function Article(){
     const navigate = useNavigate();
    const [posts,setPosts] = useState<postObj[]>([]);
    const [post,setPost] = useState<postObj>();
    useEffect(()=>{
        fetch(`${API_URL}/projects`)
            .then(res => res.json())
            .then(data => {
                console.log("data");
                console.log(data);
                if(!data){

                    navigate("/"); // z. B. deine Standardseite
                    
                }
                setPosts(data)})
            .catch(err => console.log(err));
    },[]);
    const {article} = useParams();
    const goBack = () =>{
        console.log(window.history.length);
        if(window.history.length < 3){
            navigate("/projekte");
        }
        else{
            navigate(-1);
        }
    }


    
    useEffect(() => {
    window.scrollTo(0, 0);
 
    }, []);
    useEffect(()=>{
                
                setPost( posts.find(p => p.slug == article))
        if(posts.length > 0 && (posts.find(p => p.slug == article) == undefined)){
          
            navigate("/"); 
              } },[posts])
    const createContent = (content:ContentBlock) =>{
        switch(content.type){
            case "image":
                return <img src={content.src} alt={content.alt} />
            case "paragraph":
                return <p>{content.text}</p>
            case "heading":
                if(content.level==1){
                    return <h1>{content.text}</h1>
                }
                else if(content.level == 2){
                    return <h2>{content.text}</h2>
                }
                else if(content.level == 3){
                    return <h3>{content.text}</h3>
                }
                else if(content.level == 4){
                    return <h4>{content.text}</h4>
                }
                else{
                    return <h5>{content.text}</h5>
                }
        }
    }
    return(
        <>
         {posts.length>0 ?
        <div id="blog" style={{position:'relative', paddingTop:'40px'}}>
                     <BackBtn onClick={goBack}/>
        <section className="about" >
            <img className="cover" src={post?.coverImage}/>

            <div className="data">
                <Tag tags={post?.tag ? post.tag : []}/>
                <div className="data-line">
                    <div className="author"><Link to={`${post?.author}`}>{post?.author}</Link></div> -
                    <div className="grade">{post?.grade ? post.grade : post?.status == "Lehrer" ? "Lehrer" : "Alumni" }</div>
                </div>
                <div className="publish-year">{post?.date}</div>

            </div>
            <h1 className="title">{post?.title}</h1>
        </section>
        <section className="content">
            {post?.content.map((content) => createContent(content))}
        </section> 


    </div> : ""}
        </>
    )
}
export default Article;