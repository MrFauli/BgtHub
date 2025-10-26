import { useState,useEffect } from "react";
import Box from "../box/box";
import './login.css';
import { Link,useNavigate } from 'react-router-dom';

function LoginSide(){
    
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loginSuccess,setLoginSuccess] = useState();
    const [loginTrys,setLoginTrys] = useState(3);
    const [loginError,setLoginError] = useState("");
    const [logedIn,setLogedIn] = useState<boolean>();
    
    useEffect(()=>{
            fetch("http://localhost:5000/user/logedin", {
            method: "GET",
            credentials: "include" // wichtig für Cookies
            })
            .then(res => res.json())
            .then(data => {
            if(!data){
                setLogedIn(false);
            }
            else{
               {setLogedIn(true); 
                
                
               }
            }
            })
            .catch(err => console.log(err));

       

    },[])
        useEffect(()=>{
       
        if(logedIn){
             navigate("/dashboard");
        }
        }
    ,[logedIn])

    const checkLogin = (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(email.length > 0 && password.length > 6){

        
        fetch('http://localhost:5000/user/login/',{
            method:"POST",
            
            headers: {
                "Content-Type": "application/json", // sagt dem Server: das ist JSON!
            },
            credentials: "include",
            body:JSON.stringify({
                email:email,
                password:password
            })
        
        })
        .then(res => res.json())
            .then(data => {
                setLoginSuccess(data);
                setLoginTrys(prev=>prev-1);
            })
            .catch(err => console.log(err));}
            else{
                setLoginError("Email und Password angeben!");
            }
        }
    // Evtl. einbauen, dass nur 3 versuche? 
    useEffect(()=>{
        setLoginError("");
        if(loginSuccess){
            navigate('/dashboard');
            
        }
        else if(email.length >0){
            setLoginError("Email oder Passwort ist falsch.");
        }
    },[loginTrys]);
    

    return(
        <div className="area">
        <div id='signBox'>
            <Box >
                           <h1>
                Login
            </h1>
           <form onSubmit={checkLogin}>
                <label htmlFor='mail' className='mailLabel' >Email</label>
                <input name='mail' type='email'placeholder="your.name@bbs-me.org" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <label htmlFor='password' className='passwordLabel' >Passwort</label>
                <input type="password" id="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} />
                {<span>{loginError}</span>}
                
                <button id='signInBtn' type='submit'>Einloggen</button>
                <p>Du hast kein Account? <Link to='/register' style={{color:'inherit',textDecoration:'underline'}} >Registrieren</Link></p>
            </form>
            </Box>
        </div>
        </div>
    )
}

export default LoginSide;