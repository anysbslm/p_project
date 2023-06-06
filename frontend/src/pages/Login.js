import {React, useState} from "react";
import {Link} from "react-router-dom";
import { useLogin } from '../hooks/useLogin';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, error, isLoading } = useLogin()
 
    const handleSubmit = async (e) => {
       e.preventDefault()
 
       await login(email, password)
    }
    

 
   return (
     <>
       <div class="form-center" style={{ caretColor: 'transparent' }}>
          <div class="text">
             LOGIN
          </div>
          <form onSubmit={handleSubmit}>
             <div class="field">
                <div class="fas fa-envelope"></div>
                <input type="email" 
                name="email" 
                placeholder="Email"
               onChange={(e) => setEmail(e.target.value)}
               value={email}
              />
             </div>
             <div class="field">
                <div class="fas fa-lock"></div>
                <input type="password" 
                name="password" 
                placeholder="Password"
               onChange={(e) => setPassword(e.target.value)}
               value={password}
               />
             </div>
             <button disabled={isLoading}>LOGIN</button>
             <div class="infos">
                Not a member?
                <Link to="/Signup"> Sign up now!</Link>
                {error && <div className= "error">{error}</div>}
             </div>
          </form>
       </div>
           </>
   )
 }
 
 export default Login