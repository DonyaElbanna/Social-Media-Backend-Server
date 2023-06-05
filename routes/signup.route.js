const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/signup.controller");
const authenticate = require("../utils/authentication");

router.post("", authenticate, signup);

module.exports = router;
