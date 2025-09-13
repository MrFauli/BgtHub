import React from "react";
import './actionbtn.css';

type BtnProps ={
    color: string;
    id: string;
    children:  React.ReactNode;
}
function ActionBtn({ color, id, children }:BtnProps){
    return(
        <button style={{backgroundColor:  color}} className="info-btn"id={id}> {children}</button>    
    )
}
export default ActionBtn;