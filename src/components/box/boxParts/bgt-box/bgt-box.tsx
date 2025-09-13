import {useEffect, useState, useRef} from "react";
import Box from "../../box";
import './bgt-box.css';
import ActionBtn from "../../../actionbtn/actionbtn";
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const bgtList = ["cool","spannend","einzigartig"];

function BgtBox(){
    const [typeEffectOn,setTypeEffectOn] = useState(true);
    setTypeEffectOn(true);
    const [typedText, setTypedText] =useState("");
    const [typeLineOn,setTypeLineOn] = useState(true);
    const randomNumber= ()=> {
     let number = Math.random() * 200 + 100;
     return number;
        }
    const typing = useRef(false);
    const typeEffect = async() =>{
    console.log("typeEffect");
    if (!typeEffectOn) return;
    let title = "Das BGT ist ";
    console.log("title length");
    console.log(title.length);
    
    for(let i=0; i < title.length; i++){
        if (!typeEffectOn) return;
        console.log(i);
        console.log(typedText);
        await sleep(randomNumber());
        
         setTypedText(prev => prev + title[i]);
        
        if (!typeEffectOn) return;
    }
    for (const word of bgtList) {
        setTypeLineOn(false);
        
        for(let i = 0; i < word.length; i++){
            await sleep(randomNumber());
            setTypedText(prev => prev+ word[i]);
            if (!typeEffectOn) return;
        }
        setTypeLineOn(true);
        await sleep(2000);
        setTypeLineOn(false);

        if(bgtList.indexOf(word)!=bgtList.length-1){
            for(let i = word.length-1; i >= 0; i--){
            if (!typeEffectOn) return;
            await sleep(randomNumber());
            setTypedText(prev => prev.slice(0, -1));
            
        }
       }
       else{
        setTypeLineOn(true);
       
        await sleep(1000);
        
        setTypeLineOn(false);
        setTypedText(title + word + "!");
       }
                setTypeLineOn(true);
    }

};
    useEffect(()=>{
        if (typing.current) return;
        typing.current = true;
        const typeFunc = async()=>{
            await sleep(200);
            console.log("starte effekt");
            await typeEffect();
            
        }
        typeFunc();
        return ()=>console.log("effekt zu ende");
    },[]);

    return(<Box id={"bgt-box"}>
            <div id="typing-box">
             <h1> <span id="type-space">{typedText}</span><div id="type-line" className={`${typeLineOn? "blink" : ""} `}></div></h1>
            </div>
            <div className="bgt-text">
                Werde jetzt ein Teil von ihm und erlebe, was es heißt, etwas zu lernen was einem etwas bringt!
            </div>
            <ActionBtn id="bgt-btn" color="#e48501"><a target="_blank" href="https://bbs-me.de/berufliches-gymnasium/berufliches-gymnasium">Mehr Infos!</a></ActionBtn>
            </Box>)
}

export default BgtBox;