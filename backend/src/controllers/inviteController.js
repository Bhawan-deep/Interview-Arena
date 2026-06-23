const transporter =
require("../config/mail");

const sendInvite =
async (req,res)=>{

   try{

      const {
         email,
         roomCode
      } = req.body;

      await transporter.sendMail({

         from:
         `"Interview Arena" <${process.env.EMAIL_USER}>`,

         to: email,

         subject:
         "Interview Invitation",

         text: `
You have been invited to an interview.

Room Code: ${roomCode}

Join Interview Arena and enter this room code.
         `

      });

      res.status(200).json({
         message:
         "Mail sent successfully"
      });

   }
   catch(error){

      res.status(500).json({
         message:error.message
      });

   }

};
module.exports = {
   sendInvite
};