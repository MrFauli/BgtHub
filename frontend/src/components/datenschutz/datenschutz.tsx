import { Link } from "react-router-dom";
import "./datenschutz.css";

function Datenschutz(){
    return(<div id="impressumDatenschutz">
        <div id="impressum">
    <h1>Impressum</h1>

    <p>Berufsbildende Schule Metall- und Elektrotechnik der Region Hannover – Otto-Brenner-Schule</p>
    <p>Lavesallee 14, D-30169 Hannover</p>
    <p>Telefon: 0511 26099 100</p>
    <p>E-Mail:<a href="mailto:mail@bbs-me.de"> mail@bbs-me.de</a> </p>
    <h2>Technischer Support</h2>
    <p>Konzeption, Design und technische Umsetzung der Website erfolgt durch Gianluca Carmelo Rossi. 
        
    </p>
    <p >Kontakt und technischer Support: <a href="mailto:info@bgt-hub.me"> info@bgt-hub.me</a></p>
    <h2>Rechtliche Hinweise</h2>
    
    <p>Für die Nutzung dieser Plattform gelten unsere <Link to={"/nutzungsbedingungen"}>Nutzungsbedingungen</Link>. Bitte beachten Sie, dass die Verantwortung für die eingestellten Projektinhalte bei den jeweiligen Autoren liegt. Wir distanzieren uns ausdrücklich von den Inhalten der durch Nutzer erstellten Blogs und machen uns diese nicht zu eigen.</p>
    <h2>Datenschutz</h2>
    <p>Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name oder E-Mail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Für weitere Informationen lesen sie bitte unsere Datenschutzerklärung. </p>
    </div>
    <div id="datenschutz">
    <h1>Datenschutz</h1>

    <h2>I. Erhebung und Speicherung personenbezogener Daten</h2>
    <p>
    <b>1. Bei der rein informatorischen Nutzung</b> der Website erheben wir nur die Daten, die Ihr Browser an unseren Server übermittelt (Server-Logfiles). Dies umfasst:
        <ul>
            <li>IP-Adresse</li>
            <li>Datum und Uhrzeit der Anfrage</li>
            <li>Übertragene Datenmenge</li>
            <li>Browsertyp und Betriebssystem</li>
        </ul>
        <br/>

    <b>2. Bei der Registrierung auf der Website</b> müssen folgende Daten angeben werden:
        <ul>
            <li>Vor- und Nachname</li>
            <li>E-Mail Adresse</li>
            <li>Jahrgang sofern es sich um Schüler handelt</li>
            <li>Status (Schüler, Lehrer oder Alumni)</li>
        </ul>
        </p>
    <b>3. Server-Logfiles</b>
    <p>Der Hoster der Seite erhebt automatisch Daten über Zugriffe (IP-Adresse, Datum, Uhrzeit, Browsertyp). Dies ist technisch notwendig, um die Sicherheit und Stabilität der Seite zu gewährleisten (Art. 6 Abs. 1 lit. f DSGVO).</p>
    <h2>II. Cookies</h2>
    Diese Webseite verwendet technisch notwendige Cookies.
    <ul>
        <li><b>Zweck: </b> Speicherung des Login-Status während einer Sitzung mit einem Session-Cookie</li>
        <li><b>Inhalt: </b> Das Cookie enthält eine verschlüsselte Session-ID, um den Nutzer beim Seitenwechsel wiederzuerkennen.</li>
        <li><b>Dauer: </b>Das Cookie wird nach dem Schließen des Browsers oder nach dem Logout gelöscht.</li>
        <li><b>Hinweis: </b>Da diese Cookies technisch zwingend erforderlich sind, ist keine aktive Einwilligung über einen Cookie-Banner nötig (§ 25 Abs. 2 TDDDG).</li>
    </ul>
    <h2>III. Weitergabe von Daten</h2>
    <p>Eine Weitergabe deiner Daten an Dritte zu kommerziellen Zwecken findet nicht statt.</p>
    
    </div></div>
    )
}

export default Datenschutz;