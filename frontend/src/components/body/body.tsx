
import { Outlet } from "react-router-dom";
import Footer from '../footer/footer';
import './body.css';
import Header from '../header/header';
import ScrollToTop from "../../scrollToTop";
function Body(){


    return(
        <div>
            <ScrollToTop/>
            <Header/>
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </div>
    )
}

export default Body;