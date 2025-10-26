import React from "react";
import './actionbtn.css';

type BtnProps ={
    color: string;
    id: string;
    children:  React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | void;
}
function ActionBtn({ color, id, children, onClick }:BtnProps){
    return(
        <button style={{backgroundColor:  color}}  onClick={onClick ?? (() => {})} className="info-btn"id={id}> {children}</button>    
    )
}
export default ActionBtn;