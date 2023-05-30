const express = require("express");
const router = express.Router();
const {
  getAllComments,
  getSingleComment,
  addComment,
  editComment,
  deleteComment,
} = require("../controllers/comment.controller");

router.get("", getAllComments);

router.get("/:id", getSingleComment);

router.post("", addComment);

router.patch("/:id", editComment);

router.delete("/:id", deleteComment);

module.exports = router;
