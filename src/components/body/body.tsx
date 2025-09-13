
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