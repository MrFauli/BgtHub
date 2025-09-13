import React from 'react';
import TopFooter from './footerParts/top-footer/top-footer';
import Sitemap from './footerParts/sitemap/sitemap';
import './footer.css';
function Footer(){

    return(
        
        <footer>
           <TopFooter/>
           <Sitemap/>
        </footer>
        
    );
}
export default Footer;