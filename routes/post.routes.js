const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getSinglePost,
  addPost,
  editPost,
  deletePost,
} = require("../controllers/post.controller");

router.get("", getAllPosts);

router.get("/:id", getSinglePost);

router.post("", addPost);

router.patch("/:id", editPost);

router.delete("/:id", deletePost);

module.exports = router;
