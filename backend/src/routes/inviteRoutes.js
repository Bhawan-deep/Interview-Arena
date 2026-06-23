const express =
require("express");

const router =
express.Router();

const {sendInvite} = require("../controllers/inviteController");

router.post(
   "/send-invite",
   sendInvite
);

module.exports =
router;