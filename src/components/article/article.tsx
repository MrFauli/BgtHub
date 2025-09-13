import {useEffect} from "react";
import type {postObj} from '../../types/posts';
import type {ContentBlock} from '../../types/content';
import { Link,useParams } from "react-router-dom";
import Posts from '../../posts.json';
import Tag from "../tag/tag";
import './article.css';
const Blogs: postObj[] = Posts as postObj[];
function Article(){
    const {article} = useParams();
    const post = Blogs.find(p => p.slug == article);
    console.log(post?.content)
    useEffect(() => {
    window.scrollTo(0, 0);
    }, []);
    console.log(post);
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
        <div id="blog">
        <section className="about" >
            <img className="cover" src={post?.coverImage}/>

            <div className="data">
                <Tag tags={post?.tag ? post.tag : []}/>
                <div className="data-line">
                    <div className="author"><Link to={`${post?.author}`}>{post?.author}</Link></div> -
                    <div className="grade">{post?.grade}</div>
                </div>
                <div className="publish-year">{post?.date}</div>

            </div>
            <h1 className="title">{post?.title}</h1>
        </section>
        <section className="content">
            {post?.content.map((content) => createContent(content))}
        </section>


    </div>

    )
}
export default Article;