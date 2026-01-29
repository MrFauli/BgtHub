import React from "react";
import './actionbtn.css';

type BtnProps ={
    color: string;
    id: string;
    className?: string;
    children:  React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | void;
}
function ActionBtn({ color, id,className, children, onClick }:BtnProps){
    return(
        <button style={{backgroundColor:  color}} className={"info-btn" + className}  onClick={onClick ?? (() => {})} id={id}> {children}</button>    
    )
}
export default ActionBtn;