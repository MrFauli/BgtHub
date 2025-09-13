import React, {useState} from 'react';
import type { postObj } from '../../types/posts';
import './blogPreview.css';
import { Link } from 'react-router-dom';
import Tag from '../tag/tag';
type BlogPreviewProps = {
  post: postObj; 
};

function BlogPreview({post}:BlogPreviewProps){

    
    
    return(
        
            <div id={`Article${post.id}`} className="slide">
                <Link to={"/projekte/"+post.slug}>
                    <div className="imgContainer"><img className="preview-pic" src={post.coverImage} /></div>
                    <div className="preview-infos">
                        <Tag tags={post.tag}/>
                        <div className="publish-year">{post.date}</div>
                        <h3 className="project-name">{post.title}</h3>
                        <div className="preview-text">{post.summary}</div>
                        <div className="author">{post.author}</div>
                    </div>
                </Link>
            </div>
        
    );

}
export default BlogPreview