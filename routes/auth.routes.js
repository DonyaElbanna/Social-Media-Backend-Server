const express = require("express");
const router = express.Router();
const { signIn } = require("../controllers/auth.controller");

router.post("", signIn);

module.exports = router;
