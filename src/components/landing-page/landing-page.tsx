import React from 'react';
import Opener from '../opener/opener';
import News from '../news/news';
import ProjektBox from '../box/boxParts/projektBox/projekt-box';
import BgtBox from '../box/boxParts/bgt-box/bgt-box';
import UploadBox from '../box/boxParts/upload-box/upload-box';
import Footer from '../footer/footer';
import './landing-page.css';

function LandingPage(){


    return(
        <div>
            <Opener/>
            <News/>
            <ProjektBox/>
            <div className="bottom-box">
                <BgtBox/>
                <UploadBox/>
            </div>
            
        </div>
    )
}

export default LandingPage;