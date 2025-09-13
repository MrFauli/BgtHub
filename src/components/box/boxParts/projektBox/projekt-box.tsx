import React from 'react';
import './projekt-box.css'
import Box from '../../box';
import ActionBtn from '../../../actionbtn/actionbtn';
import {Link} from 'react-router-dom';
function ProjektBox(){

    return(
        <Box id={"projekt-box"}>
            <div className="projekt-banner"> 
                 <h2>Unsere Projekte</h2>
            </div>
            <div className="projekt-text" >
                <p  >Schau dir jetzt die spannenden Projekte an, alle von Schülerinnen des BGT's umgesetzt! Von Kurzfilmen über Spielefilme bis zu Geldautomaten ist alles dabei.</p>
                <Link to="/projekte"><ActionBtn id="projekt-btn" color="#4df444" >Projekte ansehen</ActionBtn></Link>
            </div>
        </Box>
    )
}
export default ProjektBox;