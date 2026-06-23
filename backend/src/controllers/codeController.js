const axios = require("axios");

exports.runCode = async (req,res)=>{

   try{

      const {
         language,
         code,
         input
      } = req.body;

      const response =
      await axios.post(

         "https://emkc.org/api/v2/piston/execute",

         {
            language,
            version:"*",

            files:[
               {
                  content:code
               }
            ],

            stdin:input
         }

      );

      res.json(
         response.data
      );

   }

   catch(error){

      console.log(error);

      res.status(500).json({
         error:"Execution Failed"
      });

   }

};