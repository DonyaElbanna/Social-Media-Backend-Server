const Post = require("../models/post.model");
const AppError = require("../utils/Error");

// only logged user can get thier posts
const getAllPosts = async (req, res, next) => {
  const userId = req.user.id;
  const posts = await Post.find({ user: userId }).populate("user");

  if (!posts) {
    return next(new AppError("No posts found for this user!", 404));
  }
  res.send(posts);
};

const getSinglePost = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const singlePost = await Post.find({ _id: id, user: userId });
    if (!singlePost || singlePost.length == 0) {
      return next(new AppError("Post not found", 404));
    }
    res.send(singlePost);
  } catch (err) {
    return next(new AppError("Something went wrong!", 404));
  }
};

// only logged user can add a post
const addPost = async (req, res, next) => {
  const { post } = req.body;
  const user = req.user;
  // const userId = req.user.id;
  if (!post) {
    return next(new AppError("A post can't be empty", 404));
  }
  const newPost = await Post.create({
    post,
    user: { _id: user.id, role: "creator" },
  });
  res.send(newPost);
};

// logged user can only edit their posts
const editPost = async (req, res, next) => {
  const { id } = req.params;
  const { post } = req.body;
  const user = req.user;
  if (!post) {
    return next(new AppError("A post can't be empty", 404));
  }
  try {
    const editedPost = await Post.findOneAndUpdate(
      { _id: id, user: user.id },
      { post },
      {
        new: true,
      }
    );
    if (!editedPost) {
      return next(new AppError("invalid token", 404));
    }
    res.send(editedPost);
  } catch (err) {
    return next(new AppError("Something went wrong!", 404));
  }
};

// only admin and the logged user can delete their posts
const deletePost = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  try {
    if (user.role == "admin") {
      const deletedPost = await Post.findByIdAndDelete(id);
      if (!deletedPost) {
        return next(new AppError("Post not found", 404));
      }
      res.send(deletedPost);
    } else {
      const deletedPost = await Post.findOneAndDelete({
        _id: id,
        user: user.id,
      });
      if (!deletedPost) {
        return next(new AppError("invalid token", 404));
      }
      res.send(deletedPost);
    }
  } catch (err) {
    return next(new AppError("Something went wrong!", 404));
  }
};

module.exports = { getAllPosts, getSinglePost, addPost, editPost, deletePost };
