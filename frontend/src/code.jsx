import './App.css';
import { io } from "socket.io-client";
import { useEffect,useState,useRef } from "react";
import axios from "axios";

import CodeEditorDemo from "./components/CodeEditorDemo";

const socket = io("http://localhost:5000");

function App() {
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
   finalOutput
);


   } catch (err) {

      console.log(err);

   }

};

const analyzeCode = async () => {

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
         response.data.analysis
      );

   } catch(err){

      console.log(err);

   }

};




















   const messagesEndRef = useRef(null);
const [typedMessage, setTypedMessage] = useState("");
const [allMessages, setAllMessages] = useState([]);
const myCameraVideoTag=useRef(null);
const  callConnectionRef=useRef(null);
const remoteVideoTag=useRef(null);



const sendMessage = () => {
    if (!typedMessage.trim()) {
      return;
   }
   socket.emit(
   "chat-message",
   {
      roomCode: "fd-DOG",
      sender: "Bhawandeep",
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


    socket.emit(
   "join-room",
   "fd-DOG"
);

socket.on("user-joined", (msg) => {
   console.log(msg);
});
 socket.on("answer",async(answer)=>{
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
      callConnectionRef.current.ontrack =
   (event) => {

      console.log(
         "REMOTE TRACK"
      );

      console.log(
         event.streams[0]
      );

      remoteVideoTag.current.srcObject =
         event.streams[0];
   };
      callConnectionRef.current.onicecandidate =
   (event) => {
      if(event.candidate){
         socket.emit("ice-candidate",event.candidate);
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
  const offer=await callConnectionRef.current.createOffer();
  console.log(offer);

  await callConnectionRef.current.setLocalDescription(
   offer
);

console.log(
   callConnectionRef.current.localDescription
);
console.log(
   callConnectionRef.current.signalingState
);
console.log(
   callConnectionRef.current.localDescription.type
);

myCameraVideoTag.current.srcObject =
   myCameraStream;


   socket.emit("offer", offer); 
};
   startCamera();
 
//socket of reciever;
socket.on("offer",async(offer)=>{
   console.log("offer recieved");
   console.log(offer);
   await callConnectionRef.current.setRemoteDescription(offer);
   console.log("remote desc");
   console.log(callConnectionRef.current.remoteDescription)


const answer = await callConnectionRef.current.createAnswer();
await callConnectionRef.current.setLocalDescription(answer);
console.log(answer);
socket.emit("answer",answer);
})
socket.on("ice-candidate",async (candidate)=>{
   await callConnectionRef.current.addIceCandidate(candidate);
   console.log("added ice")

})
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

}, []);


  return (
   
   <div className="app-container">

    <div className="editor-section">
   <h2>Interview Arena</h2>
<select value={selectedLanguage}
onChange={(e)=>{
   const newLanguage = e.target.value;

setSelectedLanguage(newLanguage);

socket.emit(
   "language-change",
   newLanguage
);
}}>
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
  <CodeEditorDemo
   code={codes[selectedLanguage]}
  selectedLanguage={selectedLanguage}
   setCodes={setCodes}
   socket={socket}
/>
<div className="execution-panel">



   <button className="run-btn" onClick={runCode}>
      Run Code
   </button>
   <button  className="run-btn" onClick={analyzeCode}>
   Analyze Complexity
</button>
   <div className="analysis-box">

   <h3>
      AI Analysis
   </h3>

   <pre>
      {analysis}
   </pre>

</div>

   <div className="input-output-container">

      <div className="input-box">

         <h3>Input</h3>

         <textarea
            value={input}
            onChange={(e)=>{
               setInput(e.target.value)
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
</div>

    <div className="right-section">

     <div className="remote-video-container">

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

     <div className="chat-container">
<div className="messages-container">

  {allMessages.map((singlemsg,index)=>(
  <div
    className="message"
    key={index}
  >
    <strong>
      {singlemsg.sender}
    </strong>
    : {singlemsg.message}
  </div>
))}

  <div ref={messagesEndRef}></div>

</div>

  <div className="chat-input-container">

    <input
  value={typedMessage}
  onChange={(e) => setTypedMessage(e.target.value)}
  onKeyDown={(e) => {
    if (
      e.key === "Enter" &&
      typedMessage.trim()
   ) {
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

  
)};
export default App;