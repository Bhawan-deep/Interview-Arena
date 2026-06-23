const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
   apiKey: process.env.GEMINI_API_KEY
});

router.post(
   "/analyze",
   async (req,res)=>{

      try{

         const {
            code,
            language
         } = req.body;

         const prompt = `
Analyze the following code.

Return ONLY valid JSON.

Format:

{
   "timeComplexity":"",
   "spaceComplexity":"",
   "explanation":"",
   "optimization":""
}

Language:
${language}

Code:
${code}
`;

         const response =
         await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:prompt
         });

         const rawResponse =
            response.text
               .replace(/```json/g,"")
               .replace(/```/g,"")
               .trim();

         const analysis =
            JSON.parse(rawResponse);
            console.log("output");
            console.log(analysis);
            
            

         res.status(200).json(
            analysis
         );

      }
      catch(error){

         console.log(error);

         res.status(500).json({
            message:error.message
         });

      }

   }
);

module.exports = router;