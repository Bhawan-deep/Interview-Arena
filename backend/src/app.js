const express = require("express");
const cors = require("cors");

const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const inviteRoutes = require("./routes/inviteRoutes");
const codeRoutes = require("./routes/codeRoutes");
const runCodeRoutes =
require("./routes/runCodeRoutes");
const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/invite", inviteRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/run-code",runCodeRoutes);
app.use("/api/ai", aiRoutes);
app.get("/", (req, res) => {
  res.send("Interview Arena API Running");
});

module.exports = app;