const express = require("express");
const router = express.Router();
const {
  uploadImg,
//   getImg,
} = require("../controllers/avatar.controller");
const verifyToken = require("../utils/tokenVerification");
const upload = require("../utils/multer");

router.post("/:id/avatar", verifyToken,  upload.single("image"), uploadImg);
// router.get("/:id/avatar", verifyToken, getImg);

module.exports = router;