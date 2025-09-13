
import './left-btn.css';
type Props = {
  onclick: () => void;
};
function LeftBtn({ onclick }: Props){
    return(
  <button className="left-btn" onClick={onclick}><div className="line right-top"></div><div className="line right-bottom"></div></button>

    )}
export default LeftBtn;