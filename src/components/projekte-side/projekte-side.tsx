import {useState} from 'react';
import Posts from '../../posts.json';
import BlogPreview from '../blogPreview/blogPreview';
import type { postObj } from '../../types/posts';
import './projekt-side.css';
function ProjektSide(){

    const [filter,setFilter] = useState("")
    return(
        <div>
            <h1>Schülerprojekte</h1>
            <div className='filters'>
                <button style={{backgroundColor:"#e32185",border: filter == "Technik" ? "1px solid white" : ""  }} onClick={()=>filter != "Technik" ?setFilter("Technik") : setFilter("")}>Technik</button>
                <button style={{backgroundColor:"#e48501",border: filter == "Informatik" ? "1px solid white" : "" }} onClick={()=>filter != "Informatik" ?setFilter("Informatik") : setFilter("")}>Informatik</button>
                <button style={{backgroundColor:"#4df444", border: filter == "Medien" ? "1px solid white" : "" }} onClick={()=>filter != "Medien" ?setFilter("Medien") : setFilter("")}>Medien</button>
            </div>
            { filter == "" ?
                Posts.map((post)=>(
                <BlogPreview post={post as postObj}/>
            )) 
            : Posts.filter((post)=>(post.tag.some(tag=> tag == filter) )).map((post)=><BlogPreview post={post as postObj}/>)}
        </div>
    )
}
export default ProjektSide;