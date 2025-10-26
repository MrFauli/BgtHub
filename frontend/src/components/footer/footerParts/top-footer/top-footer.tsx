import {useState,useEffect} from "react";
import Logo from "../../../logo/logo";
import './top-footer.css'
function TopFooter(){
      const isSystemThemeLight= () =>{
    return window.matchMedia("(prefers-color-scheme: dark)").matches ?  false :  true};
    
    const [lightMode,setLightMode] = useState<boolean>(()=>{
        const storedItem = localStorage.getItem('theme');
        return storedItem? JSON.parse(storedItem) : isSystemThemeLight()});
   
    const toogleMode = () =>{
        setLightMode((prev) => !prev);}
    useEffect(()=>{
         document.documentElement.setAttribute("data-theme", lightMode ? 'light':'dark');
            console.log(lightMode);
            localStorage.setItem('theme',JSON.stringify(lightMode));
    
    },[lightMode]);    
    return(
        <div className="top-footer">
            <div className="logo-footer" ><Logo/></div>
            <div className="credits">with ❤️ made by <a target="_blank" href="https://github.com/MrFauli">Gianluca</a></div>
            <div><a target="_blank" href="https://github.com/MrFauli/BgtHub"><div className="dev-status"><div className="red-point"></div> in Development</div></a></div>
            <button className="color-mode" onClick={toogleMode}><img  src={lightMode? "/assets/sun.png" : "/assets/moon.png"} className="mode-icon"/></button>
        </div>
 
    )
}

export default TopFooter;