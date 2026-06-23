import Editor from "@monaco-editor/react";
import { useState } from "react";



function CodeEditorDemo({
   roomCode,
   code,
   selectedLanguage,setCodes,socket
}) {
   
   
   


   return (
       <div className="editor-wrapper">
         <Editor
         height="500px"
         language={selectedLanguage}
         value={code}
         options={{
     wordWrap:"on"
  }}
    onChange={(value)=>{

   const newCode = value || "";

   setCodes((prevCodes)=>({

      ...prevCodes,

      [selectedLanguage]: newCode

   }));

   socket.emit(
   "code-change",
   {
      
      roomCode,
      language: selectedLanguage,
      code: newCode
   }
);

}}
      />

       </div>
      
   );
}

export default CodeEditorDemo;