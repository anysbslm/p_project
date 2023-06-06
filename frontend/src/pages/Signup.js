import React, { useState} from "react";
import {Link} from "react-router-dom";
import {useSignup} from '../hooks/useSignup';

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {signup, error, isLoading} = useSignup()
 
    const handleSubmit = async (e) => {
       e.preventDefault()
 
       await signup(email, password)
    }
 

 
   return (
     
     <>
       <div class="form-center" style={{ caretColor: 'transparent' }}>
          <div class="text">
             Create account
          </div>
          <form id='reg-form' onSubmit={handleSubmit}>
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
             <button disabled={isLoading} type='submit'>Sign Up</button>
             <div class="infos">
                Already registered?
                <Link to="/Login"> Login now!</Link>
                {error && <div className='error'>{error}</div>}
             </div>
             
          </form>
       </div>
           </>
   )
 }
 
 export default Signup;