const express = require("express");
const protect = require("../middlewares/authmiddleware");
const { createRoom,joinRoom} = require("../controllers/roomController");

const router = express.Router();

router.post("/create",protect, createRoom);
router.post("/join",protect, joinRoom);

module.exports = router;