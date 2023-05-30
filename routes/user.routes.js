const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  addUser,
  editUser,
  deleteUser,
} = require("../controllers/user.controller");

router.get("", getAllUsers);

router.get("/:id", getSingleUser);

router.post("", addUser);

router.patch("/:id", editUser);

router.delete("/:id", deleteUser);

module.exports = router;
