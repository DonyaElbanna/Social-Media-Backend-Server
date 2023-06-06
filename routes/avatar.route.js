const express = require("express");
const router = express.Router();
const { uploadAvatar } = require("../controllers/avatar.controller");
const verifyToken = require("../utils/tokenVerification");
const upload = require("../utils/multer");

router.post("/:id/avatar", verifyToken, upload.single("image"), uploadAvatar);

module.exports = router;
