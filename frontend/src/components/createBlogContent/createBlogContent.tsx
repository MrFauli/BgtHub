import React, {forwardRef, useEffect, useImperativeHandle,useState} from 'react';
import uploadIcon from '/assets/uploadIcon.png';
import type { ContentBlock } from '../../types/content';
import './createBlogContent.css';

export type contentFuncs ={
    getContent: () => {content: ContentBlock[],files:File[]} | boolean;
    setContent: (content:ContentBlock[]) => void;
}
interface FileEntry {
  index: number;
  file: File;
}
function CreateBlogContent(_props:{},ref: React.Ref<contentFuncs>){
    
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [files,setFiles] =  useState<FileEntry[]>([]);
    const [error,setError] = useState<string[]>([]);

    const getMimeTypeFromFilename = (fileName:String) => {
  const extension = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      // Wichtig: Generischen Typ verwenden, falls unbekannt, aber idealerweise sollte dies nicht passieren.
      return 'application/octet-stream'; 
  }
};
    const urlToFile = async(url: string)=> {
        try{
    const response = await fetch(url);
    if (!response.ok) {
            console.error(`Fehler beim Laden der Bild-URL: ${response.status} ${response.statusText}`);
            // Hier könnten Sie einen leeren Blob oder null zurückgeben
            throw new Error('Fehler beim Abrufen der Bilddaten'); 
        }
    const blob = await response.blob();
   const filename = url.substring(url.lastIndexOf("/") + 1);

    const mimeType = getMimeTypeFromFilename(filename);

    const file = new File([blob], filename, { type: mimeType });
    return file;}
    catch(error){
        console.error("Fehler im urlToFile Prozess:", error);
        return null;
    }
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
                    alt: "",
                    caption: ""
                    };
                    break;
            case "heading":
                newBlock = {  type: "heading",
                    level: 1,
                    text: ""}
                break;
            case "link":
                 newBlock = {  type: "link",
                    url: "",
                    label: "",
                    target:"_blank"}
                break
            case "youtube":
                 newBlock = {  type: "youtube",
                    videoUrl: "",
                    videoId: ""}
                break
        }
        setBlocks([...blocks,newBlock]);
    } 

    const updateBlock = (e:React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,index: number, updated: ContentBlock,file?: File) => {
        console.log("updateeeeeeeeeeeeeee");
        console.log(blocks);
    const newBlocks = [...blocks];
    newBlocks[index] = updated;
    setBlocks(newBlocks);
    console.log(index);
    blocks.map(()=>{
        setError((e)=>[...e,""]);
    })
  const limit = 10 * 1024 * 1024;
  if(newBlocks[index].type){
         const isImageLimitReached = newBlocks.filter(b => b.type === "image").length > 6;
        if(isImageLimitReached){
            const errorMessage = "Maximal 6 Bilder erlaubt, Bild bitte wieder löschen!";
        
           
            setError((e)=>[...e.slice(0,index),errorMessage,...e.slice(index+1)]);
            // Setze das Input-Feld zurück und stoppe die Verarbeitung
            e.target.value = ''; 
            return; 
        }
  }
    if(newBlocks[index].type == "image" && file){
   
        if (!file.type.startsWith('image/')) {
       
            const errorMessage = "Bild muss .jpg, .png, .wepq oder .gif sein!"
        
           
            setError((e)=>[...e.slice(0,index),errorMessage,...e.slice(index+1)]);
            // Setze das Input-Feld zurück und stoppe die Verarbeitung
            e.target.value = ''; 
            return; 
        }
        else if(file.size > limit){
            const errorMessage = "Bild darf maximal 10Mb groß sein!"
            
            setError((e)=>[...e.slice(0,index),errorMessage,...e.slice(index+1)]);
            e.target.value = ''; 
            return; 
        }
        else{
            setError((e)=>[...e.slice(0,index),"",...e.slice(index+1)]);
        }
        console.log(newBlocks[index].src);
        if(files.some(file => file.index == index)){
            const newArr = files.map(fileOld => fileOld.index == index ? {index,file} : fileOld )
            setFiles(()=>newArr);
        }
        else{
            setFiles(prev => [...prev,{index,file}]);
        }
        console.log("Files geupdatet");
        console.log(files);
    }
    };
    const deleteBlock = (e:React.MouseEvent<HTMLButtonElement>,index:number)=>{
        console.log(index);
        e.stopPropagation()
        const element = blocks[index];
        if(element.type == "image"){
            setFiles(prev=>{return prev.filter(file=>file.index != index);
        });
        setFiles(prev=>prev.map((oldFile)=>oldFile.index > index? {index:oldFile.index-1,file: oldFile.file} : oldFile));
        }
        setBlocks(prev=>{
            return [...prev.slice(0,index),
                    ...prev.slice(index+1)
            ]
        })
    }
    useImperativeHandle(ref,()=>({
        getContent:()=>{
            console.log("updateeeeeeeeeeeeeeeE");
            console.log(blocks);
            console.log(files);
            setError(()=>[]);
            let existError = false;
            blocks.map((block,i)=>{
                let errorMessage:string = "";
                switch(block.type){
                    case "paragraph":
                        errorMessage = block.text == "" ? "Text darf nicht leer sein" : "";
                        
                         console.log(block.text);
                        break;
                    case "image":
                        const isImageLimitReached = blocks.filter(b => b.type === "image").length > 6;
                        if(isImageLimitReached){
                            errorMessage = "Maximal 6 Bilder erlaubt, bitte eines löschen!";
                        }
                        else if(error[i]=="Bild muss .jpg, .png, .wepq oder .gif sein!"){
                            errorMessage = "Bild muss .jpg, .png, .wepq oder .gif sein!";
                        }
                        else if(error[i] == "Bild darf maximal 10Mb groß sein!"){
                            errorMessage = "Bild darf maximal 10Mb groß sein!";
                        }
                        else{
                        errorMessage = block.src == "" ? "Bild muss hochgeladen sein" : "";}
                       
                          console.log(block.src);
                          console.log(errorMessage);
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
          
             const seenIndexes = new Set();
            const uniqueFiles = files.filter(item => {
            if (!seenIndexes.has(item.index)) {
                seenIndexes.add(item.index);
                return true;}
        return false;});
          const imgFiles = uniqueFiles.map((old)=>old.file);
      
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
            setFiles([]);
            console.log(content);
            content.map((block,index)=>{
                if(block.type == "image" && block.src){
                
                    urlToFile(block.src).then((file)=>file? setFiles(prev => [...prev,{index,file}]):console.log("fehler beim holen"));
                    
                    console.log(index);
                    
                }

            })
        const seenIndexes = new Set();
        const uniqueArray = files.filter(item => {
            if (!seenIndexes.has(item.index)) {
                seenIndexes.add(item.index);
                return true;}
        return false;});
            setFiles(uniqueArray);
        }

    }))
    useEffect(()=>{
        console.log(files);


    },[files]);
    return(
        <div>
            <div id="blocks">
                {
                blocks.map((block:ContentBlock,i)=>{
                    switch(block.type){

                        case "paragraph":
                            return(
                                <div className="contentBlock">
                                     <div className='contentRow'>
                            
                                <textarea style={{borderColor: error[i] ? error[i].length > 0 ?  "red" : "" : ""}} placeholder="Füge Inhalt über dein Projekt ein..."rows={4}value={block.text} key={i} onChange={(e) =>updateBlock(e,i,{...block,text:e.target.value})} />
                                    
                                
                                 <button type="button" className="delete" onClick={(e)=>deleteBlock(e,i)}><img className="icon" src="/assets/delete.png" alt="delete" /></button>
                            
                                </div>
                                {<span className="error">{error[i]}</span>}
                                </div>
                            )
                        case "image":
                            
                            return(
                                <div className="contentBlock">
                                    <div className='contentRow'>
                                <label style={{borderColor: error[i] ? error[i].length > 0 ?  "red" : "" : ""}} className="uploadBox" htmlFor={"image" +i}>
                                <input type="file" id={"image"+i} name={"image" +i} accept="image/jpeg, image/png, image/gif, image/webp"onChange={ (e)=> e.target.files && updateBlock(e,i,{...block,src:e.target.value},e.target.files[0])}  hidden/>
                                <img style={{color:"green"}}src={uploadIcon} id="uploadIcon"/>
                                <div id="uploadText">{files.find(file => file.index == i) == null ? "Bild hochladen" : "Zum ändern, neues Bild hochladen"}</div> 
                                <div id="previewBox"></div>
                                </label>
                                 <button type="button" className="delete" onClick={(e)=>deleteBlock(e,i)}><img className="icon" src="/assets/delete.png" alt="delete" /></button>
                            
                                </div>
                                 {<span className="error">{error[i]}</span>}
                                 </div>
                            )
                        case "heading":
                            return(
                                <div className="contentBlock">
                                 <div className="contentRow">   
                            <input  style={{borderColor: error[i] ? error[i].length > 0 ?  "red" : "" : ""}}
                            type="text"  placeholder="Überschrift"
                             value={block.text}
                             onChange={(e) => updateBlock(e,i, { ...block, text: e.target.value })}/>
                             <button type="button" className="delete" onClick={(e)=>deleteBlock(e,i)}><img className="icon" src="/assets/delete.png" alt="delete" /></button>
                             </div>
                              {<span className="error">{error[i]}</span>}
                              
                             </div>
                             );
                        case "link":
                            return(
                            <div className="contentBlock">
                            <div className="contentRow">   
                            <input  style={{borderColor: error[i] ? error[i].length > 0 ?  "red" : "" : ""}}
                            type="text"  placeholder="Meine Webseite"
                             value={block.label}
                             onChange={(e) => updateBlock(e,i, { ...block, label: e.target.value })}/>
                             <button type="button" className="delete" onClick={(e)=>deleteBlock(e,i)}><img className="icon" src="/assets/delete.png" alt="delete" /></button>
                             </div>
                             <input  style={{borderColor: error[i] ? error[i].length > 0 ?  "red" : "" : ""}}
                            type="text"  placeholder="https://meine-webseite.de"
                             value={block.url}
                             onChange={(e) => updateBlock(e,i, { ...block,  url: e.target.value })}/>
                             
                              {<span className="error">{error[i]}</span>}
                              
                             </div>
                             );
                            case "youtube":


    const handleYoutubeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        const id = (match && match[2].length === 11) ? match[2] : "";


        updateBlock(e, i, { 
            ...block, 
            videoUrl: url, 
            videoId: id 
        });
    };

    return (
        <div className="contentBlock" key={i}>
            <div className="contentRow">
                <input 
                    type="text" 
                    placeholder="YouTube Link einfügen..."
                    value={block.videoUrl}
                    onChange={handleYoutubeInput}
                    style={{ 
                        borderColor: error[i] && error[i].length > 0 ? "red" : "" 
                    }}
                />
                <button 
                    type="button" 
                    className="delete" 
                    onClick={(e) => deleteBlock(e, i)}
                >
                    <img className="icon" src="/assets/delete.png" alt="delete" />
                </button>
            </div>
            
            {/* Kleine Typ-sichere Vorschau */}
            {block.videoId && (
                <div style={{fontSize:"small",  marginTop: '5px' }}>
                    ✓ Video erkannt
                </div>
            )}
            
            {error[i] && <span className="error">{error[i]}</span>}
        </div>
    );
}
                                       
                            
                    
                
                })}

            </div>
            <div className="createBtns">
                
                <button type="button"  onClick={() => addBlock("heading")}>Header</button>
                <button type="button" onClick={() => addBlock("paragraph")}>Paragraph</button>
                <button type="button" onClick={() => addBlock("image")}>Bild</button>
                <button type="button" onClick={() => addBlock("link")}>Link</button>
                <button type="button" onClick={() => addBlock("youtube")}>YouTube</button>
            </div>
            
        </div>
    )

}
export default forwardRef<contentFuncs,{}>(CreateBlogContent);