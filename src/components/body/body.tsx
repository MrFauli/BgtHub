import React from 'react';
import Opener from '../opener/opener';
import News from '../news/news';
import ProjektBox from '../box/boxParts/projektBox/projekt-box';
import BgtBox from '../box/boxParts/bgt-box/bgt-box';
import UploadBox from '../box/boxParts/upload-box/upload-box';
import { Outlet } from "react-router-dom";
import Footer from '../footer/footer';
import './body.css';
import Header from '../header/header';
function Body(){


    return(
        <div>
            <Header/>
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </div>
    )
}

export default Body;