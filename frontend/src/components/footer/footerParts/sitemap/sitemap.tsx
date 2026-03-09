

import { Link } from 'react-router-dom';
import './sitemap.css';
function Sitemap(){
    return(

        <div className="sitemap">
            <h3>Infos</h3>
            <ul>
                <li> <a  href="mailto:gianlucarossi666@yahoo.com">Kontakt</a></li>
                <li><a target="_blank" href="https://bbs-me.de">BBS-ME</a></li>
                <li><Link to={"/impressum-datenschutz"}>Impressum & Datenschutz</Link></li>

                <li><Link to={"/nutzungsbedingungen"}>Nutzungsbedingungen</Link></li>
            </ul>
        </div>
    )
}
export default Sitemap;