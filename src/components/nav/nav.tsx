import {useState} from 'react';
import MenuIcon from '/assets/burger-menu.svg';
import './nav.css';
import {NavLink} from 'react-router-dom';
function Nav(){
    const [nav,setNav] = useState(false);
    const toggleMenu = () =>{
        setNav(!nav);
    }

    return(
        <div>
            <img onClick={toggleMenu} className={nav? "burger-menu burger-open" : "burger-menu"} src={MenuIcon} />
            <ul className="nav-bar" >
                <li><NavLink to="/">Home</NavLink></li>
                <li> <NavLink to="/projekte">Projekte</NavLink></li>
                <li><a target="_blank" href="https://bbs-me.de/berufliches-gymnasium/berufliches-gymnasium">BGT</a></li>    
                
            </ul>
            <nav className={nav ? "nav-open" : ""} >
                <ul>
                    <li onClick={() => setNav(false)}><NavLink to="/">Home</NavLink></li>
                    <li onClick={() => setNav(false)}> <NavLink to="/projekte">Projekte</NavLink></li>
                    <li><a target="_blank" href="https://bbs-me.de/berufliches-gymnasium/berufliches-gymnasium">BGT</a></li>    
                </ul>
            </nav>
        </div>);
}

export default Nav;