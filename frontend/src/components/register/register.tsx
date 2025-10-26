import Box from "../box/box";
import './register.css';
import { useState,useRef,useEffect } from 'react';

import { Link,useNavigate } from 'react-router-dom';
interface FormErrors {
  email: string;
  name: string;
  grade: string;
  password:string;

}
function RegisterSide(){
    const navigate = useNavigate();
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [step, setStep] = useState<"email" | "code">("email");
    const [email,setEmail]  = useState<string>("");
    const [code,setCode] = useState();
    const [userCode, setUserCode] = useState<string[]>(Array(6).fill(""));
    const [registerError,setRegisterError] = useState<FormErrors>({
        email: "",
        name:"",
        grade:"",
        password:""
    });
    const [codeError,setCodeError] = useState<string>("");
    const [trys,setTrys] = useState<number>(3);
    const [name,setName] = useState("");
    const [grade,setGrade] = useState<number>(11);
    const [password,setPassword] = useState<string>("");
    const isValidEmail = (email:string)=>{
        const regex = /^[a-zA-Z0-9._%+-]+@bbs-me\.org$/;
        return regex.test(email);
}
    const [existEmail, setExistEmail] = useState();
    const [emailTrigger,setEmailTrigger] = useState(0);
    const checkRegister = (e:React.FormEvent<HTMLFormElement>) =>{
            e.preventDefault();
        setRegisterError({
        email:"",
        password:"",
        grade:"",
        name:""});

        if(!isNameMatchingEmail(name,email)){
              setRegisterError((prev)=>({
                ...prev,
                name:`Bitte echten Namen aus der Email verwenden.\n
                        Ausnahmen? Email an info@bgt-hub.me!`
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
                email:"Email ist keine gültige Schulemail."
            }));}
          else{
            console.log("fetch überprüfen");
            console.log(existEmail)
           
            fetch(`http://localhost:5000/user/email/${email}`)
            .then(res => res.json())
            .then(data => {
              console.log("DATA:", data);
              setExistEmail(data); // kein Arrow Function nötig
              setEmailTrigger((prev)=>prev+1);
            })
            .catch(err => console.error("FEHLER:", err));
             
          }


            
            
            
            
        }
        

        
    
    useEffect(()=>{
      console.log(`Email überprüft: ${existEmail}`)
        if(existEmail && email.length >0){
            setRegisterError((prev)=>({
                ...prev,
                email:"Email hat schon ein Konto"}));
        }
        else if(!existEmail && email.length > 0 && registerError.name == "" && registerError.email =="" && registerError.grade == "" && registerError.password == ""){
        setStep("code");
            fetch(`http://localhost:5000/user/authcode/${email}`)
            .then(res => res.json())
            .then(data => setCode(data))
            .catch(err => console.log(err));
  
            }
    },[emailTrigger]);
    const checkCode = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const finalCode = userCode.join("");
        if(finalCode.length === 6){
            console.log(finalCode);
            if(finalCode == code){
                fetch('http://localhost:5000/user/register',{
                method:"POST",
                headers: {
                    "Content-Type": "application/json", // sagt dem Server: das ist JSON!
                },
                body:JSON.stringify({
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
  const match = email.match(/^([a-z]+)([a-z]*)\.([a-z]+)@bbs-me\.org$/i);
  if (!match) return null;
  const [, first, maybeSecond, last] = match;
  return { first: first + maybeSecond, last };
}

/**
 * Überprüft, ob der angegebene Name zur bbs-me.org E-Mail passt.
 */
const isNameMatchingEmail =(nameInput: string, email: string)=> {
  const emailParts = extractEmailParts(email);
  if (!emailParts) return false;

  const names = normalizeName(nameInput);
  const { first, last } = emailParts;

  const firstOk =
    names.some(n => first.startsWith(n) || n.startsWith(first));
  const lastOk =
    names.some(n => last.startsWith(n) || n.startsWith(last));

  return firstOk && lastOk;
}
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
                <label htmlFor='mail' className='mailLabel' >Email</label>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} name='mail' type='email'placeholder="your.name@bbs-me.org" />
                {<span>{registerError.email}</span>}
                <label htmlFor='name' className='nameLabel' >Vor- und Nachname</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} name='name' type='text'placeholder="Albert Einstein" />
                {<span>{registerError.name}</span>}
                <label htmlFor='grade' className='gradeLabel' >Jahrgang</label>
                <input value={grade} onChange={(e)=>setGrade(Number(e.target.value))} name='grade' type='number'placeholder="12" />
                {<span>{registerError.grade}</span>}
                <label htmlFor='password' className='passwordLabel' >Passwort</label>
                <input value={password} onChange={(e)=>setPassword(e.target.value)} name='name' type='password'placeholder="••••••••" />
                {<span>{registerError.password}</span>}
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
                                
                {<span >{codeError}</span>}
                <button id='registerBtn' type='submit'>Regristieren</button>
                </form>}
              





            </Box>
        </div>
        </div>
    )
}

export default RegisterSide;