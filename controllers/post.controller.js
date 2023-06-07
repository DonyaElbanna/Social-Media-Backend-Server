const Post = require("../models/post.model");
const AppError = require("../utils/Error");
const User = require("../models/user.model");

const {
  NOT_FOUND,
  FAILURE,
  NOT_PROCESSED,
  UNAUTHORIZED_ACCESS,
} = require("../utils/namespace.util");

// only logged user can get all posts
const getAllPosts = async (req, res, next) => {
  const posts = await Post.find().populate("comments").populate("reviews");

  if (!posts) {
    return next(new AppError(NOT_FOUND, 404));
  }
  res.status(200).json({ posts });
};

// logged user can get their own posts
// const getUserAllPosts = async (req, res, next) => {
//   const userId = req.user.id;
//   const posts = await Post.find({ user: userId }).populate("user").populate("comments").populate("reviews");;
//   // ! populate("comments")
//   if (!posts) {
//     return next(new AppError("No posts found for this user!", 404));
//   }
//   res.status(200).json({ posts });
// };

const getSinglePost = async (req, res, next) => {
  const { id } = req.params;
  // const userId = req.user.id;
  try {
    const singlePost = await Post.find({ _id: id })
      .populate("comments")
      .populate("reviews");
    if (!singlePost || singlePost.length == 0) {
      return next(new AppError(NOT_FOUND, 404));
    }
    res.status(200).json({ singlePost });
  } catch (err) {
    return next(new AppError(FAILURE, 404));
  }
};

// only logged user can add a post
const addPost = async (req, res, next) => {
  const { post } = req.body;
  const user = req.user;
  if (!post) {
    return next(new AppError(NOT_PROCESSED, 400));
  }
  const newPost = await Post.create({
    post,
    user: { _id: user.id },
  });
  const updatedUser = await User.findOneAndUpdate(
    { _id: user.id },
    { $addToSet: { posts: newPost._id } },
    { new: true }
  );
  res.status(201).json({ newPost, updatedUser });
};

// logged user can only edit their posts
const editPost = async (req, res, next) => {
  const { id } = req.params;
  const { post } = req.body;
  const user = req.user;
  if (!post) {
    return next(new AppError(NOT_PROCESSED, 400));
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
      return next(new AppError(UNAUTHORIZED_ACCESS, 401));
    }
    res.status(200).json({ editedPost });
  } catch (err) {
    return next(new AppError(FAILURE, 404));
  }
};

// only admin and the logged user can delete their posts
const deletePost = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  try {
    const post = await Post.find({ _id: id });
    if (post.length == 0) {
      return next(new AppError(NOT_FOUND, 404));
    }
    if (user.role == "admin") {
      const deletedPost = await Post.findByIdAndDelete(id);
      const updatedUser = await User.findOneAndUpdate(
        { posts: { _id: id } },
        { $pull: { posts: id } },
        { new: true }
      );

      if (!deletedPost) {
        return next(new AppError(NOT_FOUND, 404));
      }
      res.status(200).json({ deletedPost, updatedUser });
    } else {
      const deletedPost = await Post.findOneAndDelete({
        _id: id,
        user: user.id,
      });
      const updatedUser = await User.findOneAndUpdate(
        { _id: user.id },
        { $pull: { posts: id } },
        { new: true }
      );

      if (!deletedPost) {
        return next(new AppError(UNAUTHORIZED_ACCESS, 401));
      }
      res.status(200).json({ deletedPost, updatedUser });
    }
  } catch (err) {
    return next(new AppError(FAILURE, 404));
  }
};

module.exports = { getAllPosts, getSinglePost, addPost, editPost, deletePost };
