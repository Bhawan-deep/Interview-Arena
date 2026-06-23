require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");


const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB();

const server=http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {

  console.log("User Connected:", socket.id);

 socket.on("join-room", (roomCode) => {

   socket.join(roomCode);

   const room =
      io.sockets.adapter.rooms.get(roomCode);

   const count =
      room ? room.size : 0;

   console.log(
      `Room ${roomCode} has ${count} users`
   );

   socket.emit(
      "room-users-count",
      count
   );

   io.to(roomCode).emit(
      "user-joined",
      `${socket.id} joined room`
   );

});
 socket.on(
   "ready-for-offer",
   (roomCode)=>{

      socket.to(roomCode)
      .emit(
         "ready-for-offer"
      );

   }
);

 socket.on("chat-message", (data) => {
   io.to(data.roomCode).emit(
      "receive-message",
      {
         sender: data.sender,
         message: data.message
      }
   );

});
 socket.on(
   "offer",
   (data)=>{
      console.log(
         "OFFER RECEIVED"
      );

      socket.to(
         data.roomCode
      ).emit(
         "offer",
         data.offer
      );

   }
);
socket.on(
   "screen-share-stopped",
   (roomCode)=>{

      socket.to(roomCode).emit(
         "screen-share-stopped"
      );

   }
);
 socket.on(
   "answer",
   (data)=>{

      socket.to(
         data.roomCode
      ).emit(
         "answer",
         data.answer
      );

   }
);
  socket.on(
   "ice-candidate",
   (data)=>{

      socket.to(
         data.roomCode
      ).emit(
         "ice-candidate",
         data.candidate
      );

   }
);
   socket.on(
   "code-change",
   (data) => {

      socket.to(
         data.roomCode
      ).emit(
         "code-change",
         data
      );

   }
);


socket.on(
   "language-change",
   (data)=>{
      socket.to(
         data.roomCode
      ).emit(
         "language-change",
         data.language
      );

   }
);
socket.on(
   "output-change",
   (data)=>{

      socket.to(
         data.roomCode
      ).emit(
         "output-change",
         data.output
      );

   }
);



  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });

});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});