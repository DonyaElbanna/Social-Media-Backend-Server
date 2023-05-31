const express = require("express");
const router = express.Router();
const {
  getAllComments,
  getSingleComment,
  addComment,
  editComment,
  deleteComment,
} = require("../controllers/comment.controller");

router.get("/:postid/comment", getAllComments);

router.get("/:postid/comment/:id", getSingleComment);

router.post("/:postid/comment", addComment);

router.patch("/:postid/comment/:id", editComment);

router.delete("/:postid/comment/:id", deleteComment);

module.exports = router;
