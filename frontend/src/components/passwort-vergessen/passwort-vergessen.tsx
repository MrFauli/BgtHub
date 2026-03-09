import Box from "../box/box";
import './passwort-vergessen.css';
import { useState,useRef,useEffect } from 'react';
import { API_URL } from '../../config.ts';
import { Link,useNavigate } from 'react-router-dom';
interface FormErrors {
        mail:string,
        password:string,
        loginError:string
}
function ResetPassword(){
    const navigate = useNavigate();
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [step, setStep] = useState<"email" | "code">("email");
    const [email,setEmail]  = useState<string>("");
    const [code,setCode] = useState();
    const [userCode, setUserCode] = useState<string[]>(Array(6).fill(""));
    
    const [registerError,setRegisterError] = useState<FormErrors>({
        mail:"",
        password:"",
        loginError:""
    });
    const [codeError,setCodeError] = useState<string>("");
    const [trys,setTrys] = useState<number>(3);
  
    const [password,setPassword] = useState<string>("");


    const [existEmail, setExistEmail] = useState();
    const [emailTrigger,setEmailTrigger] = useState(0);
    const checkRegister = (e:React.FormEvent<HTMLFormElement>) =>{
            e.preventDefault();
        setRegisterError({
        mail:"",
        password:"",
        loginError:""});
       
                 validatePassword(password)
            console.log("fetch überprüfen");
            console.log(existEmail)
            
            fetch(`${API_URL}/user/email/${email}`)
            .then(res => res.json())
            .then(data => {
              console.log("DATA:", data);
              setExistEmail(data.status);
              setEmailTrigger((prev)=>prev+1);
            })
            .catch(err => console.error("FEHLER:", err));  
        }
        

        
    
    useEffect(()=>{
      console.log(`Email überprüft: ${existEmail}`)
      
           if(existEmail && email.length >0 && registerError.password == ""){
            setStep("code");
            fetch(`${API_URL}/user/authcode/${email}`)
            .then(res => res.json())
            .then(data => {setCode(data.hash), console.log(data)})
            .catch(err => console.log(err));
        }
    },[emailTrigger]);
    const checkCode = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const finalCode = userCode.join("");
        if(finalCode.length === 6){
            let codeTrue = false;
            console.log(code)
            const response = await fetch(`${API_URL}/user/authcode/compare`, {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, check: finalCode, email })
        });

        codeTrue = await response.json();
if (codeTrue) {
    try {
        const resetRes = await fetch(`${API_URL}/user/reset-password`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword: password })
        });

        if (resetRes.status === 201) {
            console.log("Passwort geändert!");
            navigate("/login");
        }
    } catch (err) {
        console.log("Fehler beim Reset:", err,);
    }
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
                {step == "email" ? 'Passwort zurücksetzen' : 'Code eingeben'}
            </h1>
            {step == "email" ?   <form onSubmit={checkRegister}>
                <label htmlFor='mail' className='mailLabel' >Email</label>
                <input name='mail' type='email'placeholder="your.name@bbs-me.org" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <label htmlFor='password' className='passwordLabel' >Passwort</label>
                <input type="password" id="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} />
                {<span>{registerError.loginError}</span>}
 
                
                <button style={{background:"red"}} id='signInBtn' type='submit'>Passwort zurücksetzen</button>
                
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
                <button id='registerBtn' type='submit'>Zurücksetzen</button>
                </form>}
              





            </Box>
        </div>
        </div>
    )
}

export default ResetPassword;