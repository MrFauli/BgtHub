import React,{useState} from "react";
import Logo from "../../../logo/logo";
import './top-footer.css'
function TopFooter(){
    const [lightMode,setLightMode] = useState(false);
    const toogleMode = () =>{
        setLightMode((prev) => !prev);
    }
    return(
        <div className="top-footer">
            <div className="logo-footer" ><Logo/></div>
            <div className="credits">with ❤️ made by Gianluca</div>
            <div className="dev-status"><div className="red-point"></div> in Development</div>
            <button className="color-mode" onClick={toogleMode}><img  src={lightMode? "src/assets/sun.png" : "src/assets/moon.png"} className="mode-icon"/></button>
        </div>
 
    )
}

export default TopFooter;