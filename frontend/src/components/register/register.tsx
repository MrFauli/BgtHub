import Box from "../box/box";
import './register.css';
import { useState,useRef,useEffect } from 'react';
import { API_URL } from '../../config.ts';
import { Link,useNavigate } from 'react-router-dom';
interface FormErrors {
  status:string;
  email: string;
  name: string;
  grade: string;
  password:string;
  check:string;
}
function RegisterSide(){
    const navigate = useNavigate();
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [step, setStep] = useState<"email" | "code">("email");
    const [email,setEmail]  = useState<string>("");
    const [code,setCode] = useState();
    const [userCode, setUserCode] = useState<string[]>(Array(6).fill(""));
    
    const [registerError,setRegisterError] = useState<FormErrors>({
        status:"",
        email: "",
        name:"",
        grade:"",
        password:"",
        check:""
    });
    const [codeError,setCodeError] = useState<string>("");
    const [trys,setTrys] = useState<number>(3);
    const [status,setStatus] = useState<string>("Schüler");
    const [name,setName] = useState("");
    const [grade,setGrade] = useState<number>(11);
    const [password,setPassword] = useState<string>("");
    const isValidEmail = (email:string)=>{
        const regex = status == "Lehrer" ? /^[a-zA-Z0-9._%+-]+@bbs-me\.de$/ :status=="Alumni" ? /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ :  /^[a-zA-Z0-9._%+-]+@bbs-me\.org$/;
        return regex.test(email);
}
    const [nutzungChecked, setNutzungChecked] = useState(false);
    const [existEmail, setExistEmail] = useState();
    const [emailTrigger,setEmailTrigger] = useState(0);
    const checkRegister = (e:React.FormEvent<HTMLFormElement>) =>{
            e.preventDefault();
        setRegisterError({
        status:"",
        email:"",
        password:"",
        grade:"",
        name:"",
        check:""});
        if(status==""){
          setRegisterError((prev)=>({
                ...prev,
                status:`Bitte Auswählen ob Schüler, Lehrer oder Alumni.`
            }));
        }
        if(!nutzungChecked){
          setRegisterError((prev)=>({
                ...prev,
                check:`Bitte Nutzungsbedingungen akzeptieren.`
            }));
        }
        if(!isNameMatchingEmail(name,email) && status == "Schüler"){
              setRegisterError((prev)=>({
                ...prev,
                name:`Bitte echten Namen aus der Email verwenden.\n
                        Fehler? Email an Support/Admin!`
            }));}
            if(grade != 11 && grade != 12 && grade != 13){
                 setRegisterError((prev)=>({
                ...prev,
                grade:`Jahrgang muss 11-13 sein.`
            }));}
            validatePassword(password)
        if(!isValidEmail(email)){
            setRegisterError((prev)=>({
                ...prev,
                email:status=="Schüler" ?"Email ist keine gültige Schulemail." : status=="Lehrer" ? "Email ist keine gültige Lehreremail." : "Email ist keine gültige Emailaddresse."
            }));}
          else{
            console.log("fetch überprüfen");
            console.log(existEmail)
            
            fetch(`${API_URL}/user/email/${email}`)
            .then(res => res.json())
            .then(data => {
              console.log("DATA:", data);
              setExistEmail(data.status); // kein Arrow Function nötig
              setEmailTrigger((prev)=>prev+1);
            })
            .catch(err => console.error("FEHLER:", err));
             
          }
        }

    useEffect(()=>{
      console.log(`Email überprüft: ${existEmail}`)
      
           if(existEmail && email.length >0 && existEmail == "Alumni" && status == "Alumni" && registerError.name == "" && registerError.email =="" && registerError.grade == "" && registerError.password == ""){
setStep("code");
            fetch(`${API_URL}/user/authcode/${email}`)
            .then(res => res.json())
            .then(data => {setCode(data.hash), console.log(data)})
            .catch(err => console.log(err));
        }
        else if(existEmail && email.length >0 && existEmail != "Alumni"){
            setRegisterError((prev)=>({
                ...prev,
                email:"Email hat schon ein Konto"}));
        }
   

     
        else if(!existEmail && email.length > 0 && registerError.name == "" && registerError.email =="" && registerError.grade == "" && registerError.password == "" && status != "Alumni"){
        setStep("code");
            fetch(`${API_URL}/user/authcode/${email}`)
            .then(res => res.json())
            .then(data => {setCode(data.hash), console.log(data)})
            .catch(err => console.log(err));
  
            }
        else if(!existEmail && email.length > 0 && status=="Alumni"){
          setRegisterError((prev)=>({
                ...prev,
                email:"Bitte an Admin/Lehrkraft E-Mail schreiben, damit wir bestätigen können dass du ein ehemaliger Schüler bist."}));
        }
    },[emailTrigger]);
    const checkCode = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const finalCode = userCode.join("");
        if(finalCode.length === 6){
            let codeTrue = false;
            const response = await fetch(`${API_URL}/user/authcode/compare`, {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, check: finalCode})
        });

          codeTrue = await response.json();
          console.log(code)
          console.log(finalCode)
          console.log(codeTrue)
          if (codeTrue) {
            if( status!="Alumni"){
                fetch(`${API_URL}/user/register`,{
                method:"POST",
                headers: {
                    "Content-Type": "application/json", // sagt dem Server: das ist JSON!
                },
                body:JSON.stringify({
                  status:status,
                    name:name,
                    email: email,
                    grade: grade,
                    password: password
                })
            })
             .then(res => res.json())
                .then(data => console.log(data))
                .catch(err => console.log(err));
                navigate("/login");
            }
            else if( status=="Alumni") {
              fetch(`${API_URL}/user/register`,{
                method:"PUT",
                headers: {
                    "Content-Type": "application/json", // sagt dem Server: das ist JSON!
                },
                body:JSON.stringify({
                  status:status,
                    name:name,
                    email: email,
                    password: password,
                    admin_rechte: false
                })
            })
             .then(res => res.json())
                .then(data => console.log(data))
                .catch(err => console.log(err));
                navigate("/login");
            }}
            else{
                if(trys-1>0){
                    setCodeError(`Nicht der richtige Code, noch ${trys-1} versuche.`);
                }
                else{
                    setCodeError(`Zu viele falsche Versuche, neuer Code wurde gesendet...`);
                }
                setTrys(prev=> prev-1);
            }   
        }
    }
    
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // nur Ziffern erlauben
    const newValues = [...userCode];
    newValues[index] = value;
    setUserCode(newValues);
    // Automatisch weiter zum nächsten Input
    if (value && index < 6 - 1) {
      inputsRef.current[index + 1]?.focus();
    } 
  };
  // Wechselt zum nächsten input(ref => input fields)
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !userCode[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
    

  const normalizeName = (name: string)=> {
  return name
    .toLowerCase()
    .replace(/[^a-zäöüß ]/g, "") // Sonderzeichen entfernen
    .split(/\s+/)
    .filter(Boolean);
}

const extractEmailParts = (email: string)=> {
  const match = email.match(/^([a-z]+)([a-z]*)\.([a-z]+)@.+\..+$/i);
  if (!match) return null;
  const [, first, maybeSecond, last] = match;
  return { first: first + maybeSecond, last };
}

const checkEmailType = (email: string): 'OLD' | 'NEW' | 'INVALID' => {
  if (/^[a-z]+\.[a-z]+@/i.test(email)) return 'OLD'; // vorname.nachname
  if (/^\d+\.[a-z0-9]+\.[a-z0-9]+@/i.test(email)) return 'NEW';
  return 'INVALID';
};

const isNameMatchingEmail = (nameInput: string, email: string): boolean => {
  const type = checkEmailType(email);
  console.log(type);
  const names = normalizeName(nameInput); // Deine bestehende Funktion [cite: 3, 4]

  if (type === 'OLD') {
    // Deine bestehende Logik für das alte System
    const emailParts = extractEmailParts(email);
    if (!emailParts) return false;
    const { first, last } = emailParts;
    return names.some(n => first.includes(n)) && names.some(n => last.includes(n));
  }

  if (type === 'NEW') {
    // Beim neuen System können wir nur die Initialen prüfen
    const match = email.match(/^\d+\.([a-z])\.([a-z])@/i);
    if (!match) return false;
    
    const [ , firstInitial, lastInitial] = match;
    const firstOk = names[0]?.startsWith(firstInitial.toLowerCase());
    const lastOk = names[names.length - 1]?.startsWith(lastInitial.toLowerCase());
    
    // ACHTUNG: Das ist schwach. Hier sollte zusätzlich gegen eine 
    // Datenbank (CSV-Import der Schule) geprüft werden!
    return firstOk && lastOk;
  }

  return false;
};
const  validatePassword =(password: string)=> {
  

  if (password.length < 8) {
   setRegisterError((prev)=>({
                ...prev,
                password:"Das Passwort muss mindestens 8 Zeichen lang sein."}));
  }

  else if (!/[a-z]/.test(password)) {
    setRegisterError((prev)=>({
                ...prev,
                password:"Es muss mindestens ein Kleinbuchstabe enthalten sein."}));
  }

  else if (!/[A-Z]/.test(password)) {
    setRegisterError((prev)=>({
                ...prev,
                password:"Es muss mindestens ein Großbuchstabe enthalten sein."}));
  }

  else if (!/[0-9]/.test(password)) {
    setRegisterError((prev)=>({
                ...prev,
                password:"Es muss mindestens eine Zahl enthalten sein."}));
  }

  else if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;'\\/]/.test(password)) {
    setRegisterError((prev)=>({
                ...prev,
                password:"Es muss mindestens ein Sonderzeichen enthalten sein."}));
  }
  else{
    setRegisterError((prev)=>({
                ...prev,
                password:""}));
    return true;
  }
  return false;
}
    return(
        <div className="area">
        <div id='registerBox'>
            
            <Box >
            <h1>
                {step == "email" ? 'Registrieren' : 'Code eingeben'}
            </h1>
            {step == "email" ?  <form onSubmit={checkRegister}>
                <label  htmlFor='status' className="statusLabel">Status: {status}</label>
                <div className="statusBox">
                  <button type="button" className={status == "Schüler" ? "selectedStatus" : ""} onClick={()=>setStatus("Schüler")}><img className="statusIcon" src='/assets/student.png'/></button>
                  <button type="button" className={status == "Lehrer" ? "selectedStatus" : ""} onClick={()=>setStatus("Lehrer")}><img className="statusIcon" style={{paddingTop:"4px"}} src='/assets/teacher.png'/></button>
                  <button type="button" className={status == "Alumni" ? "selectedStatus" : ""} onClick={()=>setStatus("Alumni")}><img className="statusIcon" src='/assets/alumni.png'/></button>
                </div>
                {<span className="error">{registerError.status}</span>}
                <label htmlFor='mail' className='mailLabel' >Email</label>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} name='mail' type='email'placeholder={status == "Schüler" ? "your.name@bbs-me.org" : status== "Lehrer"? "your.name@bbs-me.de" : "your.name@email.de"} />
                {<span className="error">{registerError.email}</span>}
                <label htmlFor='name' className='nameLabel' >Vor- und Nachname</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} name='name' type='text'placeholder="Albert Einstein" />
                {<span className="error">{registerError.name}</span>}
                {status == "Schüler" ? <><label htmlFor='grade' className='gradeLabel' >Jahrgang</label>
                <input value={grade} onChange={(e)=>setGrade(Number(e.target.value))} name='grade' type='number'placeholder="12" /> 
                {<span className="error">{registerError.grade}</span>} </>: <></>}
                <label htmlFor='password' className='passwordLabel' >Passwort</label>
                <input value={password} onChange={(e)=>setPassword(e.target.value)} name='name' type='password'placeholder="••••••••" />
                {<span className="error">{registerError.password}</span>}
                <div className="checkbox-container">
                        <input 
                          type="checkbox" 
                          id="privacy-check" 
                          name="privacy"
                          checked={nutzungChecked}
                          onChange={(e) => setNutzungChecked(e.target.checked)}
                          required 
                        />
                    <label htmlFor="privacy-check">
                    Ich habe die Datenschutzerklärung gelesen.
                  </label>
                  </div>
                {<span className="error">{registerError.check}</span>}
                <button id='registerBtn' type='submit'>Regristieren</button>
                <p>Du hast schon ein Account? <Link to='/login' style={{color:'inherit',textDecoration:'underline'}} >Anmelden</Link></p>
            </form>
            :
            <form onSubmit={checkCode}>

                
                <div style={{ display: "flex",gap:'0.5rem',justifyContent:'center' }}>
                {userCode.map((c, i) => (
                    <input
                    key={i}
                     ref={(el) => { inputsRef.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={c}
                    onChange={(e)=>handleChange(i,e.target.value) }
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    
                    className='codeInputs'
                    />
                ))}
                </div> 
                                
                {<span className="error">{codeError}</span>}
                <button id='registerBtn' type='submit'>Regristieren</button>
                </form>}
              





            </Box>
        </div>
        </div>
    )
}

export default RegisterSide;