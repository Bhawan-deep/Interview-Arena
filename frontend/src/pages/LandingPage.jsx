import "./LandingPage.css";
import { useState } from "react";
import AuthModal from "../pages/AuthModal";
import heroImage from "../assets/hero.svg";
import secimg from "../assets/secimg.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function LandingPage(){
   const username =
   localStorage.getItem(
      "username"
   );
   const [showJoinModal,setShowJoinModal] =
   useState(false);

const [joinRoomCode,setJoinRoomCode] =
   useState("");
   const joinRoom = async()=>{

   try{

      const token =
         localStorage.getItem("token");

      const response =
         await axios.post(
            "http://localhost:5000/api/rooms/join",
            {
               roomCode: joinRoomCode
            },
            {
               headers:{
                  Authorization:
                  `Bearer ${token}`
               }
            }
         );

      navigate(
         `/interview/${response.data.room.roomCode}`
      );

   }
   catch(err){

      alert(
         err.response?.data?.message
         || "Failed to join room"
      );

   }

};
  const [showAuthModal,setShowAuthModal] =
   useState(false);

 const createRoom = async()=>{

   try{

      const token =
         localStorage.getItem("token");

      const response =
         await axios.post(
            "http://localhost:5000/api/rooms/create",
            {},
            {
               headers:{
                  Authorization:
                  `Bearer ${token}`
               }
            }
         );

      navigate(
         `/interview/${response.data.room.roomCode}`
      );

   }
   catch(err){

      console.log(err);

      if(
         err.response?.status === 401
      ){

         localStorage.removeItem(
            "token"
         );

         setIsLogin(true);
         setShowAuthModal(true);

      }

   }

};


const [isLogin,setIsLogin] =
   useState(true);
  const navigate=useNavigate();
    return (
   <div className="landing-page">

      <nav className="navbar">

        <h2>Interview Arena</h2>

        <div className="nav-links">

   <div className="features-dropdown">

      <button>
         Features ▼
      </button>

      <div className="dropdown-menu">

         <p>Video Calls</p>

         <p>Collaborative Editor</p>

         <p>Run Code</p>

         <p>AI Analysis</p>

         <p>Screen Share</p>

      </div>

   </div>

   {
      username ? (

      <div className="user-menu">

   <div className="user-avatar">
      {username.charAt(0).toUpperCase()}
   </div>
   <button
      className="logout-btn"
      onClick={()=>{
         localStorage.clear();
         window.location.reload();
      }}
   >
      Logout
   </button>

</div>
      ) : (

         <>
            <button
               onClick={()=>{
                  setIsLogin(false);
                  setShowAuthModal(true);
               }}
            >
               Register
            </button>

            <button
               className="login-btn"
               onClick={()=>{
                  setIsLogin(true);
                  setShowAuthModal(true);
               }}
            >
               Login
            </button>
         </>

      )
   }

</div>

      </nav>

      <section className="hero">
        

        <div className="hero-left">

         <h2>
  Collaborative Coding
  <br />
  Interviews
</h2>

          <p>
  Video calls, collaborative coding,
  real-time code execution and AI-powered
  interview assistance in one place.
</p>

          <div className="hero-buttons">

          <button
onClick={async()=>{

   const token =
      localStorage.getItem("token");

   if(!token){

      setIsLogin(true);
      setShowAuthModal(true);
      return;
   }

   await createRoom();

}}
>
   Start Interview
</button>

           <button
onClick={()=>{

   const token =
      localStorage.getItem("token");

   if(!token){

      setIsLogin(true);
      setShowAuthModal(true);
      return;
   }

   setShowJoinModal(true);

}}
>
   Join Room
</button>

          </div>

        </div>

  <div className="hero-right">

   <img
      src={heroImage}
      alt="Interview Illustration"
      className="hero-image1"
   />
    <img
      src={secimg}
      alt="Interview Illustration"
      className="hero-image2"
   />

</div>

      </section>
      <section className="features">

  <h2>Why Interview Arena?</h2>

  <div className="feature-cards">

    <div className="feature-card">
      <div className="feature-icon">🎥</div>
      <h3>Video Interviews</h3>
      <p>
        Conduct face-to-face technical interviews
        with integrated video calling.
      </p>
    </div>

    <div className="feature-card">
      <div className="feature-icon">💻</div>
      <h3>Collaborative Coding</h3>
      <p>
        Write code together in real time with
        synchronized editors.
      </p>
    </div>

    <div className="feature-card">
      <div className="feature-icon"></div>
      <h3>Run Code Instantly</h3>
      <p>
        Execute code directly during interviews
        and review results instantly.
      </p>
    </div>

  </div>

</section>

{
   showAuthModal && (

      <AuthModal
         isLogin={isLogin}
         setIsLogin={setIsLogin}
         onClose={()=>{
            setShowAuthModal(false);
         }}
      />

   )
}
{
   showJoinModal && (

      <div className="invite-modal">

         <div className="invite-content">

            <h3>
               Join Interview Room
            </h3>

            <input
               type="text"
               placeholder="Enter Room Code"
               value={joinRoomCode}
               onChange={(e)=>{
                  setJoinRoomCode(
                     e.target.value
                  );
               }}
            />

            <button
               onClick={joinRoom}
            >
               Join
            </button>

            <button
               onClick={()=>{
                  setShowJoinModal(
                     false
                  );
               }}
            >
               Close
            </button>

         </div>

      </div>

   )
}

    </div>
  );
}

export default LandingPage;