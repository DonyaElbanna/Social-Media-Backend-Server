const express = require("express");
const router = express.Router();
const { login } = require("../controllers/auth.controller");
const authenticate = require("../utils/authentication");

router.post("", authenticate, login);

module.exports = router;
