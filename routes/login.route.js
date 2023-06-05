const express = require("express");
const router = express.Router();
const { login } = require("../controllers/login.controller");
const authenticate = require("../utils/authentication");

router.post("", authenticate, login);

module.exports = router;
