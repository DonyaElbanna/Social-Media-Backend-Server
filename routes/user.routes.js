const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  addUser,
  editUser,
  deleteUser,
} = require("../controllers/user.controller");
const verifyToken = require("../utils/tokenVerification");

router.get("", getAllUsers);

router.get("/:id", getSingleUser);

router.post("", addUser);

router.patch("/:id", verifyToken, editUser);

router.delete("/:id", verifyToken, deleteUser);

module.exports = router;
