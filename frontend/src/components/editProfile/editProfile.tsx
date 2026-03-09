import { useState,useEffect } from "react";
import Box from "../box/box";
import './editProfile.css';
import { Link,useNavigate } from 'react-router-dom';
import { API_URL } from '../../config.ts';
function EditProfile(){
    
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [status,setStatus] = useState("")
    const [grade,setGrade] = useState<number>(11);
    const [loginSuccess,setLoginSuccess] = useState();
    const [loginTrys,setLoginTrys] = useState(3);
    const [user,setUser] = useState<object>({});
    const [loginError,setLoginError] = useState("");
    const [gradeError,setGradeError] = useState("");
    const [logedIn,setLogedIn] = useState<boolean>();
    const [changeSaved,setChangeSaved] = useState(false)
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
                console.log(data.status)
               }
            }
            })
            .catch(err => console.log(err));

       

    },[])
    const changeGrade = (e:React.FormEvent<HTMLFormElement>) =>{
         e.preventDefault();
        if(11 > grade || grade>13){
            setGradeError("Gib deine gültigen Jahrgang ein (11,12 oder 13")
        }
        else{

            setUser((prev)=> ({
                ...prev,
                grade: grade
            }));
            setChangeSaved(true);
            setGradeError("");
        }
    }
   
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
    },[user])

    return(
        <div className="area">
        <div id='signBox'>
            <Box >
                           <h1>
                Account bearbeiten
            </h1>
            <h2 style={{margin:0}}>Daten ändern</h2>
           {status == "Schüler" && <form className="editProfileForm" onSubmit={changeGrade}>    
                 
                 <label htmlFor='grade' className='gradeLabel' >Jahrgang</label>
                 <input value={grade} onChange={(e)=>setGrade(Number(e.target.value))} name='grade' type='number'placeholder="12" /> 
                {<span>{gradeError
                }</span>}

                <button id='saveGrade' type='submit'>Ändern</button>
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
            </Box>
        </div>
        </div>
    )
}

export default EditProfile; 