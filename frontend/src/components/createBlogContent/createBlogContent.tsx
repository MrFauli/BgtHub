import React, {forwardRef, useImperativeHandle,useState} from 'react';
import uploadIcon from '/assets/uploadIcon.png';
import type { ContentBlock } from '../../types/content';
import './createBlogContent.css';
import type { postObj } from '../../types/posts';
export type contentFuncs ={
    getContent: () => {content: ContentBlock[],files:File[]} | boolean;
    setContent: (content:ContentBlock[]) => void;
}
interface FileEntry {
  index: number;
  file: File;
}
function CreateBlogContent(props:{},ref: React.Ref<contentFuncs>){

    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [files,setFiles] =  useState<FileEntry[]>([]);
    const [error,setError] = useState<string[]>([]);
    const urlToFile = async(url: string)=> {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
    // Hier optional: MIME-Typ beibehalten
    const file = new File([blob], filename, { type: blob.type });
    return file;
    }
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

    const updateBlock = (index: number, updated: ContentBlock,file?: File) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updated;
    setBlocks(newBlocks);
    if(newBlocks[index].type == "image" && file){
        if(files.some(file => file.index == index)){
            files.map(fileOld => fileOld.index == index ? file : fileOld );
        }
        else{
            setFiles(prev => [...prev,{index,file}]);
        }
        console.log("Files geupdatet");
        console.log(files);
    }
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
            const imgFiles = files.map((old)=>old.file);
            if(!existError){
                return {content: blocks,
                    files:imgFiles
                };
            }
            else{
                return false;
            }
        },
        setContent:(content)=>{
            setBlocks(content);
            console.log(content);
            content.map((block,index)=>{
                if(block.type == "image"){
                    urlToFile(block.src).then((file)=>setFiles(prev => [...prev,{index,file}]))
                    
                }
            })
        }

    }))
  
    return(
        <div>
            <div id="blocks">
                {
                blocks.map((block:ContentBlock,i)=>{
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
                                <input type="file" id={"image"+i} name={"image" +i} accept='image/*'onChange={ (e)=> e.target.files && updateBlock(i,{...block,src:e.target.value},e.target.files[0])}  hidden/>
                                <img style={{color:"green"}}src={uploadIcon} id="uploadIcon"/>
                                <div id="uploadText">{files.find(file => file.index == i) == null ? "Bild hochladen" : "Zum ändern, neues Bild hochladen"}</div> 
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