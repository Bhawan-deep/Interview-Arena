import './InterviewPage.css';
import { io } from "socket.io-client";
import { useEffect,useState,useRef } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import CodeEditorDemo from "../components/CodeEditorDemo";

const socket = io("http://localhost:5000");


function InterviewPage() {
   const [analyzing,setAnalyzing] =
useState(false);
   const [running,setRunning] =
useState(false);
   const [inviteEmail,setInviteEmail] =
   useState("");

const [showInviteModal,
      setShowInviteModal] =
   useState(false);
    const { roomCode } = useParams();
console.log(roomCode);
const isOfferCreatorRef =
   useRef(false);
    const [analysis,setAnalysis] =useState("");
const [selectedLanguage,setSelectedLanguage]=useState("javascript");
const [codes,setCodes] = useState({

   javascript:
      'console.log("Hello World");',

   python:
      'print("Hello World")',

   java:
`public class Main {

   public static void main(String[] args){

   }

}`,

   cpp:
`#include <iostream>

using namespace std;

int main(){

   return 0;

}`
});
const [input, setInput] = useState("");
const [output, setOutput] = useState("");

const runCode = async () => {
     setRunning(true);
   try {
         

      const response = await axios.post(
         "http://localhost:5000/api/run-code",
         {
            code: codes[selectedLanguage],
            language: selectedLanguage,
            input: input
         }
      );

    const finalOutput =
   response.data.stderr ||
   response.data.stdout;

setOutput(finalOutput);

socket.emit(
   "output-change",
   {
      roomCode,
      output: finalOutput
   }
);


   } catch (err) {

      console.log(err);

   }finally{
      setRunning(false);
   }

};

const analyzeCode = async () => {
  
  

      setAnalyzing(true);

   try {

      const response =
      await axios.post(
         "http://localhost:5000/api/ai/analyze",
         {
            code: codes[selectedLanguage],
            language: selectedLanguage
         }
      );

      setAnalysis(
         response.data
      );

   } catch(err){

      console.log(err);

   }
      finally{

      setAnalyzing(false);

   }

};
const sendInvite = async()=>{

   try{

      await axios.post(
         "http://localhost:5000/api/invite/send-invite",
         {
            email: inviteEmail,
            roomCode
         }
      );

      alert(
         "Invite sent successfully"
      );

      setInviteEmail("");

      setShowInviteModal(false);

   }
   catch(err){

      console.log(err);

      alert(
         err.response?.data?.message
         || "Failed to send invite"
      );

   }

};
const shareScreen = async () => {

   try{

      const screenStream =
      await navigator.mediaDevices
      .getDisplayMedia({
         video:true
      });


      const screenTrack =
   screenStream.getVideoTracks()[0];
   screenTrack.onended = () => {
         socket.emit(
      "screen-share-stopped",
      roomCode
   );
   


  if(screenShareVideoTag.current){

      screenShareVideoTag.current.srcObject =
         null;

   }

   setScreenActive(false);

};

   callConnectionRef.current.addTrack(
      screenTrack,
      screenStream
   );

      console.log(
         "SCREEN STREAM",
         screenStream
      );

      console.log(
         screenStream.getTracks()
      );

      console.log(
         screenStream.getVideoTracks()
      );

   }
   catch(err){

      console.log(err);

   }

};
const [screenActive,
      setScreenActive] =
   useState(false);
const videoTrackCountRef = useRef(0);
 const messagesEndRef = useRef(null);
const [typedMessage, setTypedMessage] = useState("");
const [allMessages, setAllMessages] = useState([]);
const myCameraVideoTag=useRef(null);
const  callConnectionRef=useRef(null);
const remoteVideoTag=useRef(null);
const screenShareVideoTag =useRef(null);
const sendMessage = () => {
    if (!typedMessage.trim()) {
      return;
   }
   socket.emit(
   "chat-message",
   {
      roomCode,
    sender:
localStorage.getItem(
   "username"
),
      message: typedMessage
   }
);
 setTypedMessage("");

}

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth"
  });
}, [allMessages]);

  useEffect(() => {  
//sockets of sender;
socket.on(
   "screen-share-stopped",
   ()=>{

      screenShareVideoTag.current.srcObject =
         null;
         setScreenActive(false);


   }
);

socket.on(
   "ready-for-offer",
   async ()=>{

      console.log(
         "READY FOR OFFER"
      );

      if(
         isOfferCreatorRef.current
      ){

         await createAndSendOffer();

      }

   }
);
 socket.on("answer",async(answer)=>{
    console.log(
         "ANSWER RECEIVED"
      );
   await callConnectionRef.current.setRemoteDescription(answer);
   console.log("answer recieved");
   console.log(callConnectionRef.current.remoteDescription);
  })

socket.on(
   "receive-message",
   (incomingMessage) => {

      setAllMessages(
         (previousMessages) => [
            ...previousMessages,
            incomingMessage
         ]
      );

   }
);
 const startCamera = async () => {
  const myCameraStream =
await navigator.mediaDevices.getUserMedia({
   video: true,
   audio: true
});

callConnectionRef.current =
      new RTCPeerConnection();
    callConnectionRef.current.onnegotiationneeded =
async ()=>{

   console.log(
      "NEGOTIATION NEEDED"
   );

   if(
      isOfferCreatorRef.current
   ){
      await createAndSendOffer();
   }

};
      callConnectionRef.current.ontrack =
(event) => {

   console.log(
      "TRACK RECEIVED"
   );

   console.log(
      event.track.kind
   );

   if(
      event.track.kind === "video"
   ){

      videoTrackCountRef.current++;

      console.log(
         "VIDEO COUNT:",
         videoTrackCountRef.current
      );

      if(
         videoTrackCountRef.current === 1
      ){

         console.log(
            "CAMERA STREAM"
         );

         remoteVideoTag.current.srcObject =
            event.streams[0];

      }
      else{

         console.log(
            "SCREEN STREAM"
         );

        setScreenActive(true);

setTimeout(()=>{

   if(screenShareVideoTag.current){

      screenShareVideoTag.current.srcObject =
         event.streams[0];

   }

},200);

      }

   }

};
      callConnectionRef.current.onicecandidate =
   (event) => {
      if(event.candidate){
        socket.emit(
   "ice-candidate",
   {
      roomCode,
      candidate:event.candidate
   }
);
      }

   };

   callConnectionRef.current.onconnectionstatechange =
   () => {

      console.log(
         "STATE:",
         callConnectionRef.current
            .connectionState
      );

   };

   myCameraStream.getTracks().forEach((track) => {
      callConnectionRef.current.addTrack(track,myCameraStream);
      
   });
   console.log(
   callConnectionRef.current
);
//   const offer=await callConnectionRef.current.createOffer();
//   console.log(offer);

//   await callConnectionRef.current.setLocalDescription(
//    offer
// );
myCameraVideoTag.current.srcObject =
   myCameraStream;


//    socket.emit("offer", offer); 
};


const createAndSendOffer = async () => {

   const offer =
      await callConnectionRef.current
      .createOffer();

   await callConnectionRef.current
      .setLocalDescription(offer);

   console.log(
      "OFFER CREATED"
   );

 socket.emit(
   "offer",
   {
      roomCode,
      offer
   }
);

};
 
//socket of reciever;
socket.on(
   "offer",
   async (offer)=>{
     console.log(
         "OFFER RECEIVED"
      );

      if(!callConnectionRef.current){
         console.log(
            "Peer connection not ready"
         );
         return;
      }

      await callConnectionRef.current
         .setRemoteDescription(offer);

      const answer =
         await callConnectionRef.current
         .createAnswer();

      await callConnectionRef.current
         .setLocalDescription(answer);

      socket.emit(
         "answer",
         {
            roomCode,
            answer
         }
      );

   }
);
socket.on(
   "ice-candidate",
   async (candidate)=>{
      console.log(
         "ICE RECEIVED"
      );

      if(!callConnectionRef.current){
         console.log(
            "PC not ready for ICE"
         );
         return;
      }

      await callConnectionRef.current
         .addIceCandidate(candidate);

   }
);
socket.on(
   "code-change",
   (data)=>{

      setCodes((prev)=>({

         ...prev,

         [data.language]:
            data.code

      }));

   }
);

socket.on(
   "room-users-count",
   async (count)=>{

      console.log(
         "ROOM COUNT:",
         count
      );

      await startCamera();

      socket.emit(
   "ready-for-offer",
   roomCode
);

      if(count === 1){

        
          isOfferCreatorRef.current =
      true;
      }

   }
);
socket.on(
   "language-change",
   (incomingLanguage)=>{

      setSelectedLanguage(
         incomingLanguage
      );

   }
);
socket.on(
   "output-change",
   (output) => {

      setOutput(output);

   }
);


socket.emit(
   "join-room",
   roomCode
);


  return () => {

      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("receive-message");
      socket.off("code-change");
      socket.off("language-change");
      socket.off("output-change");
      socket.off("room-users-count");
      socket.off("ready-for-offer");
      socket.off("screen-share-stopped");

   };


}, []);


 return (

<>
  <div className="app-container">

   <div className="left-panel">

      <div className="room-header">

   <div className="header-left">

      <h2>
         Interview Arena
      </h2>

      <span>
         Room: {roomCode}
      </span>

   </div>

   <div className="header-right">

      <button
         onClick={()=>{
            setShowInviteModal(true);
         }}
      >
         Invite
      </button>

      <button
         onClick={shareScreen}
      >
         Share Screen
      </button>

   </div>

</div>

      <div className="editor-toolbar">

   <select
      value={selectedLanguage}
      onChange={(e)=>{
         const newLanguage =
            e.target.value;

         setSelectedLanguage(
            newLanguage
         );

         socket.emit(
            "language-change",
            {
               roomCode,
               language:newLanguage
            }
         );
      }}
   >
      <option value="javascript">
         JavaScript
      </option>

      <option value="java">
         Java
      </option>

      <option value="python">
         Python
      </option>

      <option value="cpp">
         C++
      </option>

   </select>

</div>


      <div className="editor-wrapper">

   <CodeEditorDemo
      roomCode={roomCode}
      code={codes[selectedLanguage]}
      selectedLanguage={selectedLanguage}
      setCodes={setCodes}
      socket={socket}
   />

</div>
<div className="action-bar">

   <button
   className="run-btn"
   onClick={runCode}
   disabled={running}
>
   {
      running
      ? "Running..."
      : "Run Code"
   }
</button>

  <button
   className="run-btn"
   onClick={analyzeCode}
   disabled={analyzing}
>
   {
      analyzing
      ? "Analyzing..."
      : "Analyze Complexity"
   }
</button>

</div>
<div className="analysis-box">

   <h3>
      AI Analysis
   </h3>

   {
      analysis && (

         <>
            <div className="complexity-grid">

               <div className="metric-card">

                  <span>
                      Time Complexity
                  </span>

                  <strong>
                     {
                        analysis.timeComplexity
                     }
                  </strong>

               </div>

               <div className="metric-card">

                  <span>
                     Space Complexity
                  </span>

                  <strong>
                     {
                        analysis.spaceComplexity
                     }
                  </strong>

               </div>

            </div>

      



         </>

      )
   }

</div>
  <div className="io-section">

   <div className="input-box">

      <h3>Input</h3>

      <textarea
         value={input}
         onChange={(e)=>{
            setInput(e.target.value);
         }}
         placeholder="Custom input..."
      />

   </div>

   <div className="output-box">

      <h3>Output</h3>

      <pre>
         {output}
      </pre>

   </div>

</div>

   </div>

   <div className="right-panel">

{
   screenActive && (

     <div
   className={
      screenActive
      ? "screen-share-section active"
      : "screen-share-section"
   }
>


         <video
            ref={screenShareVideoTag}
            autoPlay
            playsInline
         />

      </div>

   )
}
    <div
   className={
      screenActive
      ? "video-section small-video"
      : "video-section full-video"
   }
>
  

   <div className="video-wrapper">

      <video
         ref={remoteVideoTag}
         autoPlay
         playsInline
      />

      <div className="local-video-container">

         <video
            ref={myCameraVideoTag}
            autoPlay
            playsInline
            muted
         />

      </div>

   </div>

</div>

      <div className="chat-section">

   <div className="messages-container">

      {allMessages.map(
         (singlemsg,index)=>(
           <div
   className={
      singlemsg.sender ===
      localStorage.getItem("username")
      ? "message own-message"
      : "message"
   }
   key={index}
>
               <strong>
                  {singlemsg.sender}
               </strong>

               : {singlemsg.message}
            </div>
         )
      )}

      <div
         ref={messagesEndRef}
      ></div>

   </div>

   <div className="chat-input-container">

      <input
         value={typedMessage}
         onChange={(e)=>
            setTypedMessage(
               e.target.value
            )
         }
         onKeyDown={(e)=>{
            if(
               e.key==="Enter" &&
               typedMessage.trim()
            ){
               sendMessage();
            }
         }}
      />

      <button
         onClick={sendMessage}
      >
         Send
      </button>

   </div>

</div>

   </div>

</div>
 {
      showInviteModal && (

         <div className="invite-modal">

            <div className="invite-content">

               <h3>
                  Invite Candidate
               </h3>

               <input
                  type="email"
                  placeholder="Enter Email"
                  value={inviteEmail}
                  onChange={(e)=>{
                     setInviteEmail(
                        e.target.value
                     );
                  }}
               />
               <p>
                  {roomCode}
               </p>

               <button
                  onClick={sendInvite}
               >
                  Send Invite
               </button>

               <button
                  onClick={()=>{
                     setShowInviteModal(
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

</>

)
};
export default InterviewPage;