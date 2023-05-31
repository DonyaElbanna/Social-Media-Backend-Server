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
const authenticate = require("../utils/authentication");

router.get("", getAllUsers);

router.get("/:id", getSingleUser);

router.post("", authenticate, addUser);

router.patch("/:id", verifyToken, authenticate, editUser);

router.delete("/:id", verifyToken, deleteUser);

module.exports = router;
