import React from "react";
import './right-btn.css';
type Props = {
  onclick: () => void;
};
function RightBtn({ onclick }: Props){
    return(
  <button className="right-btn"onClick={onclick}><div className="line left-top"></div><div className="line left-bottom"></div></button>

    )}
export default RightBtn;