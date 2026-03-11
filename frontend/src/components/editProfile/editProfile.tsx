import { useState,useEffect,useRef } from "react";
import Box from "../box/box";
import './editProfile.css';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config.ts';
interface userData {
  author_id:string;
  email: string;
  name: string;
  grade: number;
  password:string;
  status:string;
  admin_rechte:boolean;
   
}

function EditProfile(){
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [step, setStep] = useState<"email" | "code">("email");    
    const navigate = useNavigate();
    const [email,setEmail] = useState("");

    const [status,setStatus] = useState("")
    const [grade,setGrade] = useState<number>();
    const [mail,setMail] = useState("");

    const [user,setUser] = useState<userData>({author_id:"",email:"",name:"",grade:11,password:"",status:"",admin_rechte:false,});

    const [gradeError,setGradeError] = useState("");

    const [changeSaved,setChangeSaved] = useState(false)
    const [trys,setTrys] = useState<number>(3);
        const [code,setCode] = useState();
        const [userCode, setUserCode] = useState<string[]>(Array(6).fill(""));
        
    const [mailError,setMailError] = useState("");
        const [codeError,setCodeError] = useState<string>("");
    useEffect(()=>{
            fetch(`${API_URL}/user/data`, {
            method: "GET",
            credentials: "include" // wichtig für Cookies
            })
            .then(res => res.json())
            .then(data => {
            if(!data){
                navigate("/login");
            }
            else{
               { 
                setEmail(data.mail)
                setStatus(data.status)
                setUser(data)
                if(data.status == "Schüler"){
                    setGrade(data.grade);
                }
                setMail(data.email)
                console.log(data.email)
                console.log(data.status)
               }
            }
            })
            .catch(err => console.log(err));

       

    },[])
    const changeGrade = (e:React.FormEvent<HTMLFormElement>) =>{
         e.preventDefault();
        if(grade && 11 > grade || grade && grade>13){
            setGradeError("Gib deine gültigen Jahrgang ein (11,12 oder 13).")
        }
        else if(grade){

            setUser((prev)=> ({
                ...prev,
                grade: grade
            }));
            setChangeSaved(true);
            setGradeError("");
        }
    }
    const changeMail = async(e:React.FormEvent<HTMLFormElement>) =>{
        console.log("Moin")
        e.preventDefault();
         const existMail = await fetch(`${API_URL}/user/email/${mail}`,{
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            
    }).then(res => res.json());
    console.log(existMail.status)
        if(existMail.status){
           setMailError("E-Mail hat bereits ein Konto.") 
        }
    else{
         setUser((prev)=> ({
                ...prev,
                email:mail
            }));
            fetch(`${API_URL}/user/authcode/${mail}`)
            .then(res => res.json())
            .then(data => {setCode(data.hash), console.log(data)})
            .catch(err => console.log(err));
            setStep("code");
            setMailError("");
            console.log("change Mail")
    }}
    useEffect(()=>{
        if(changeSaved){
            console.log(user)
            fetch(`${API_URL}/user/change/`, {
            method: "PUT",
            headers: {
                    "Content-Type": "application/json", // sagt dem Server: das ist JSON!
                },
            body: JSON.stringify(user),
            credentials: "include" // wichtig für Cookies
            })
            setChangeSaved(false)
        }
    },[user,changeSaved])
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
    console.log("true ja")
    setChangeSaved(true);
    setStep("email")
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
    return(
        <div className="area">
        <div id='signBox'>
            <Box >
                           <h1>
                 {step == "email" ? 'Account bearbeiten' : 'Code eingeben'}
            </h1>
            <h2 style={{margin:0}}>Daten ändern</h2>
               {step == "email" ? <>
            {status == "Schüler" && <form className="editProfileForm" onSubmit={changeGrade}>    
                 
                 <label htmlFor='grade' className='gradeLabel' >Jahrgang</label>
                 <input value={grade} onChange={(e)=>setGrade(Number(e.target.value))} name='grade' type='number'placeholder="12" /> 
                {<span>{gradeError
                }</span>}

                <button id='saveGrade' type='submit'>Ändern</button>
                </form>}
           {status == "Alumni" && <form className="editProfileForm" onSubmit={changeMail}>    
                 
                 <label htmlFor='changeMail' className='changeMailLabel' >E-Mail</label>
                 <input value={mail} onChange={(e)=>setMail(e.target.value)} name='changeMail' type='email' /> 
                {<span>{mailError
                }</span>}

                <button id='saveChangeMail' type='submit'>Ändern</button>
                </form>}

                {/* <div className="checkbox-container">
                        <input 
                          type="checkbox" 
                          id="allowedAnonym" 
                          name="privacy"
                          checked={nutzungChecked}
                          onChange={(e) => setNutzungChecked(e.target.checked)}

                        />
                    <label htmlFor="allowedAnonoym">
                    Ich habe die Datenschutzerklärung gelesen.
                  </label>
                  </div> */}
                  </>
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

export default EditProfile; 