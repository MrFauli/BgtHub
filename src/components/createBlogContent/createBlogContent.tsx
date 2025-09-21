import React, {forwardRef, useImperativeHandle,useState} from 'react';
import uploadIcon from '/assets/uploadIcon.png';
import type { ContentBlock } from '../../types/content';
import './createBlogContent.css';
export type contentFuncs ={
    getContent: () => ContentBlock[] | boolean;
}
function CreateBlogContent(props:{},ref: React.Ref<contentFuncs>){
    console.log(props);
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [error,setError] = useState<string[]>([]);
    const addBlock = (block:ContentBlock["type"]) =>{
        let newBlock:ContentBlock;
        switch(block){
            case "paragraph":
                newBlock = {
                    type: "paragraph", // genau dieser Wert
                    text: ""
                    };
                break;
            case "image":
                newBlock = {
                    type: "image",
                    src: "",
                    alt: ",",
                    caption: ""
                    };
                    break;
            case "heading":
                newBlock = {  type: "heading",
                    level: 1,
                    text: ""}
                break;
        }
        setBlocks([...blocks,newBlock]);
    } 

    const updateBlock = (index: number, updated: ContentBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updated;
    setBlocks(newBlocks);
    };
    useImperativeHandle(ref,()=>({
        getContent:()=>{
            setError(()=>[]);
            let existError = false;
            blocks.map((block)=>{
                let errorMessage:string = "";
                switch(block.type){
                    case "paragraph":
                        errorMessage = block.text == "" ? "Text darf nicht leer sein" : "";
                        
                         console.log(block.text);
                        break;
                    case "image":
                        errorMessage = block.src == "" ? "Bild muss hochgeladen sein" : "";
                         
                          console.log(block.src);
                        break;
                    case 'heading':
                        errorMessage = block.text == "" ? "Überschrift darf nicht leer sein" : "";
                        
                         console.log(block.text);
                        break;
                    

                }
                setError((e)=>[...e,errorMessage]);
                existError = errorMessage != "" ? true : existError;
            })
            console.log(error);
            console.log(existError);
            if(!existError){
                return blocks;
            }
            else{
                return false;
            }
        }

    }))
  
    return(
        <div>
            <div id="blocks">
                {blocks.map((block:ContentBlock,i)=>{
                    switch(block.type){

                        case "paragraph":
                            return(
                                <div className="contentBlock">
                                <textarea style={{borderColor: error[i] ? error[i].length > 0 ?  "red" : "" : ""}} placeholder="Füge Inhalt über dein Projekt ein..."rows={4}value={block.text} key={i} onChange={(e) =>updateBlock(i,{...block,text:e.target.value})}>
                                    
                                </textarea>
                                {<span className="error">{error[i]}</span>}
                                </div>
                            )
                        case "image":
                            return(
                                <div className="contentBlock">
                                <label style={{borderColor: error[i] ? error[i].length > 0 ?  "red" : "" : ""}} className="uploadBox" htmlFor={"image" +i}>
                                <input type="file" id={"image"+i} name={"image" +i} accept='image/*'onChange={(e)=>updateBlock(i,{...block,src:e.target.value})}  hidden/>
                                <img style={{color:"green"}}src={uploadIcon} id="uploadIcon"/>
                                <div id="uploadText">Bild hochladen</div> 
                                <div id="previewBox"></div>
                                </label>
                                 {<span className="error">{error[i]}</span>}
                                 </div>
                            )
                        case "heading":
                            return(
                                <div className="contentBlock">
                            <input  style={{borderColor: error[i] ? error[i].length > 0 ?  "red" : "" : ""}}
                            type="text"  placeholder="Überschrift"
                             value={block.text}
                             onChange={(e) => updateBlock(i, { ...block, text: e.target.value })}/>
                              {<span className="error">{error[i]}</span>}
                             </div>);
                                
                            
                    }
                })}

            </div>
            <div className="createBtns">
                
                <button type="button" onClick={() => addBlock("heading")}>Header</button>
                <button type="button" onClick={() => addBlock("paragraph")}>Paragraph</button>
                <button type="button" onClick={() => addBlock("image")}>Bild</button>
            </div>
            
        </div>
    )

}
export default forwardRef<contentFuncs,{}>(CreateBlogContent);