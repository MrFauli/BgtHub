

type BackBtnProps = {
  onClick?: () => void; // optional, falls kein Handler übergeben
};
function BackBtn({onClick}:BackBtnProps){


    return(
         <button className="back" style={{ position: 'absolute', top: 0, left: '6%', backgroundColor:"transparent", color:'inherit' }} onClick={onClick}>Zurück</button>
    )
}

export default BackBtn;