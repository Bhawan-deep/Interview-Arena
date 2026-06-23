const Room = require("../models/Room");
const { nanoid } = require("nanoid");
const createRoom = async (req, res) => {
   try {
    let roomCode;
    let exists = true;

   while(exists){

   roomCode = nanoid(6);

   exists = await Room.findOne({
      roomCode
   });

}
    const room= await Room.create({
        roomCode,
         createdBy:req.user._id,
         participants: [
             req.user._id,
            ]
    });
     res.status(201).json({
      message: "Room created successfully",
      room,
    });

   } catch(error) {
 res.status(500).json({
      message: error.message
    });
   }
}

const joinRoom = async (req, res) => {
    console.log("hitted");
  try {
    const { roomCode } = req.body;

    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({
        message: "Room does not exist anymore!",
      });
    }

    let alreadyJoined = false;

    for (let participant of room.participants) {
      if (
        participant.toString() ===
        req.user._id.toString()
      ) {
        alreadyJoined = true;
        break;
      }
    }

    if (alreadyJoined) {
      return res.status(400).json({
        message: "You are already in this room",
      });
    }

    room.participants.push(req.user._id);

    if (room.participants.length >= 2) {
      room.status = "active";
    }

    await room.save();

    res.status(200).json({
      message: "Room joined successfully",
      room,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports={
    createRoom,joinRoom
}