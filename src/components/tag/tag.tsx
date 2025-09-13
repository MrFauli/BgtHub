import React from "react";
import './tag.css';
type Props = {
  tags: string[];
};
function Tag({tags}:Props){
        const getTagColor = (tag:string) =>{
        switch(tag) {
            case "Informatik":
                return "#e48501";
                
            case "Technik":
                return "#e32185";
                
            case "Medien":
                return "#4df444";
                
            default:
                return "#2cade3";
    }}

    return(
        <span className="tagname">
            {tags.map((tag)=>(
                <span style={{backgroundColor: getTagColor(tag)}}>{tag}</span>
            ))}
        </span>
    )
}

export default Tag;