import React from 'react';
import logo from '../../assets/bbs-me.svg'
import './logo.css';
import { Link } from 'react-router-dom';
function Logo(){
    return(
        <div>

            <Link to="/"><img  id="logo"src={logo}/></Link>
        </div>
    )
}
export default Logo;