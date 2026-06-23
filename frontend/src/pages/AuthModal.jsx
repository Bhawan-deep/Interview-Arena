import "./AuthModal.css";
import { useState } from "react";
import axios from "axios";
import register from "../assets/register.svg"
import login from "../assets/login.svg"
const API_URL =
   import.meta.env.VITE_API_URL;

function AuthModal({
   isLogin,
   setIsLogin,
   onClose
}) {

   const [name,setName] =
      useState("");

   const [email,setEmail] =
      useState("");

   const [password,setPassword] =
      useState("");

   const handleSubmit =
   async ()=>{

      try{

         if(isLogin){

            const response =
            await axios.post(
               `${API_URL}/api/auth/login`,
               {
                  email,
                  password
               }
            );

            localStorage.setItem(
               "token",
               response.data.token
            );
            console.log(
   response.data
);
            localStorage.setItem(
   "username",
   response.data.user.name
);

            alert(
               "Login Successful"
            );

            onClose();

         }
         else{

            await axios.post(
               `${API_URL}/api/auth/register`,
               {
                  name,
                  email,
                  password
               }
            );

            alert(
               "Registration Successful"
            );

            setIsLogin(true);

            setName("");
            setEmail("");
            setPassword("");

         }

      }
      catch(err){

         alert(
            err.response?.data?.message
            || "Something went wrong"
         );

      }

   };

   return (

      <div className="auth-overlay">

       <div className="auth-modal">

   <div className="auth-image">
      <img
         src={isLogin?login:register}
         alt="auth"
      />
   </div>

   <div className="auth-form">

      <button
         className="close-btn"
         onClick={onClose}
      >
         ✕
      </button>

      <h2>
         {isLogin ? "Login" : "Register"}
      </h2>

      {!isLogin && (
         <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e)=>
               setName(e.target.value)
            }
         />
      )}

      <input
         type="email"
         placeholder="Email"
         value={email}
         onChange={(e)=>
            setEmail(e.target.value)
         }
      />

      <input
         type="password"
         placeholder="Password"
         value={password}
         onChange={(e)=>
            setPassword(e.target.value)
         }
      />

      <button
         className="auth-btn"
         onClick={handleSubmit}
      >
         {isLogin ? "Login" : "Register"}
      </button>

      <p>
         {isLogin
            ? "Don't have an account?"
            : "Already have an account?"
         }

         <span
            className="toggle-auth"
            onClick={()=>
               setIsLogin(!isLogin)
            }
         >
            {isLogin
               ? " Register"
               : " Login"
            }
         </span>

      </p>

   </div>

</div>
      </div>

   );

}

export default AuthModal;