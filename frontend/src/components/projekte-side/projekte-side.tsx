import {useState,useEffect} from 'react';
// import Posts from '../../posts.json';
import BlogPreview from '../blogPreview/blogPreview';
import type { postObj } from '../../types/posts';
import './projekt-side.css';
import { API_URL } from '../../config.ts';
function ProjektSide(){
    const [filter,setFilter] = useState("")
    const [posts,setPosts] = useState<postObj[]>([]);
    useEffect(()=>{
        console.log(`filter: ${filter}`);
        let url = `${API_URL}/projects/tag/`;
        if(filter.length != 0){
            url += `?tag=${filter}`;
        }
        console.log(url);
        fetch(url)
            .then(res => res.json())
             .then(data => {
                            setPosts(()=>data.filter((article:postObj) => article.visible == true));
                        console.log(data);
                        })
            .catch(err => console.log(err));
    },[filter]);


    return(
        <div>
            <h1>Schülerprojekte</h1>
            <div className='filters'>
                <button style={{backgroundColor:"#e32185",border: filter == "Technik" ? "1px solid white" : ""  }} onClick={()=>filter != "Technik" ?setFilter("Technik") : setFilter("")}>Technik</button>
                <button style={{backgroundColor:"#e48501",border: filter == "Informatik" ? "1px solid white" : "" }} onClick={()=>filter != "Informatik" ?setFilter("Informatik") : setFilter("")}>Informatik</button>
                <button style={{backgroundColor:"#4df444", border: filter == "Medien" ? "1px solid white" : "" }} onClick={()=>filter != "Medien" ?setFilter("Medien") : setFilter("")}>Medien</button>
            </div>
            { 
                posts.map((post)=>(
                <BlogPreview post={post as postObj}/>
            )) 
            }
        </div>
    )
}
export default ProjektSide;