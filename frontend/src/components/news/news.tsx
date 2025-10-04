import React,{useState,useEffect} from 'react';

import BlogPreview from '../blogPreview/blogPreview';
import LeftBtn from '../left-btn/left-btn';
import RightBtn from '../right-btn/right-btn';
import type {postObj} from '../../types/posts';
import './news.css';

function News(){
    const [postsNum,setPostsNum] = useState(4);
    const [touchStart,setTouchStart] = useState(0);
    const [touchEnd,setTouchEnd] = useState(0);
    const [slide,setSlide] = useState(1);
    const [translateValue, setTranslateValue] = useState(slide*100);
    const [transitionSlide,setTransitionSlide] = useState(true);
    const [manual,setManual] = useState(false);
    const [posts,setPosts] = useState<postObj[]>([]);
    useEffect(()=>{
        if(posts.length != 0){
            setPostsNum(posts.length);

        }
    },[posts]);

    useEffect(()=>{
        fetch("http://localhost:5000/projects")
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.log(err));
        
        
    },[]);


    useEffect(()=>{
   
        setTranslateValue(slide * 100);
  
             console.log(slide);
    },[slide]);
    const swipeRight = () =>{
        setSlide(slide+1);
        setTransitionSlide(true);
        setManual(true);
    }

    useEffect(()=>{
        let difference= touchStart - touchEnd;
   
        if(difference >= 20){
        
            swipeRight();
            console.log(`swipe right`);
        }
        else if(difference <= -20){
            swipeLeft();   
            console.log(`swipe left`);
        }
    },[touchEnd])
   useEffect(() => {
    if(!manual) return;
    setManual(false);
  const interval = setInterval(() => {
    setTransitionSlide(true);
    setSlide(slide => slide+1);
    console.log(slide);
    console.log("tick");
    
  }, 15000);

  return () => clearInterval(interval);
}, [manual]); 


    const swipeLeft = () =>{
        setSlide(slide-1);
        setTransitionSlide(true);
        setManual(true);
    }
    const handleSwipe = (e:React.TouchEvent<HTMLDivElement>) =>{
        setTouchEnd(e.changedTouches[0].pageX);
        
    }
    const infiniteSwipe = () =>{
        console.log(`infinteSwipe ${slide}`);
        setTransitionSlide(false);
        setSlide(slide <= 0 ? 3 : slide >= 4  ? 1 : slide);
        console.log(`after ${slide}`);
    }
    
    return(
        <div>
            <h2>Die neusten Projekte</h2>
            <div className="slider-wrapper" onTouchStart={(e)=>setTouchStart(e.touches[0].clientX)} onTouchEnd={handleSwipe} >
                {posts.length == 0 ? <div></div> : 
                <div className="slider" style={{transform: `translate(-${translateValue}%)`, transition: transitionSlide ? `transform 0.3s ease` : ``}} onTransitionEnd={infiniteSwipe} >
                     :<BlogPreview post={posts[postsNum-3] as postObj}/>
                    <BlogPreview post={posts[postsNum-1] as postObj}/>
                    <BlogPreview post={posts[postsNum-2] as postObj}/>
                    <BlogPreview post={posts[postsNum-3] as postObj}/>
                    <BlogPreview post={posts[postsNum-1] as postObj}/>
                </div>}
                <LeftBtn onclick={swipeLeft}/>
                <RightBtn onclick={swipeRight}/>
            </div>
        </div>
    )
}

export default News;