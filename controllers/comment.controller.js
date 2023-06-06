const Comment = require("../models/comment.model");
const AppError = require("../utils/Error");
const Post = require("../models/post.model");

const {
  NOT_FOUND,
  FAILURE,
  NOT_PROCESSED,
  UNAUTHORIZED_ACCESS,
} = require("../utils/namespace.util");

// getting all comments on a post
const getAllComments = async (req, res, next) => {
  const { postid } = req.params;
  try {
    const comments = await Comment.find({ post: postid });
    if (comments.length == 0) {
      return next(new AppError(NOT_FOUND, 404));
    }
    res.status(200).json({ comments });
  } catch (err) {
    return next(new AppError(FAILURE, 404));
  }
};

const getSingleComment = async (req, res, next) => {
  const { postid, id } = req.params;
  try {
    const comment = await Comment.findOne({ _id: id, post: postid });
    if (!comment) {
      return next(new AppError(NOT_FOUND, 404));
    }
    res.status(200).json({ comment });
  } catch (err) {
    return next(new AppError(FAILURE, 404));
  }
};

const addComment = async (req, res, next) => {
  const { postid } = req.params;
  const user = req.user;
  const { comment } = req.body;
  try {
    const post = await Post.find({ _id: postid });
    if (post.length == 0) {
      return next(new AppError(NOT_FOUND, 404));
    }
    if (!comment) {
      return next(new AppError(NOT_PROCESSED, 400));
    }
    const newComment = await Comment.create({
      comment,
      post: postid,
      user: user.id,
    });
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postid },
      { $addToSet: { comments: newComment._id } },
      { new: true }
    );
    res.status(200).json({ newComment, updatedPost });
  } catch (err) {
    return next(new AppError(FAILURE, 404));
  }
};

// only logged user can edit their own comments
const editComment = async (req, res, next) => {
  const { postid, id } = req.params;
  const user = req.user;
  const { comment } = req.body;
  if (!comment) {
    return next(new AppError(NOT_PROCESSED, 400));
  }
  try {
    const editedComment = await Comment.findOneAndUpdate(
      { _id: id, post: postid, user: user.id },
      { comment },
      {
        new: true,
      }
    );
    if (!editedComment) {
      return next(new AppError(UNAUTHORIZED_ACCESS, 401));
    }
    res.status(200).json({ editedComment });
  } catch (err) {
    return next(new AppError(FAILURE, 404));
  }
};

// comment's creator or the admin can delete a comment on a post
const deleteComment = async (req, res, next) => {
  const { postid, id } = req.params;
  const user = req.user;

  const comment = await Comment.find({ _id: id, post: postid });
  if (comment.length == 0) {
    return next(new AppError(NOT_FOUND, 404));
  }
  try {
    if (user.role == "admin") {
      const deletedComment = await Comment.findOneAndDelete({
        _id: id,
        post: postid,
      });
      const updatedPost = await Post.findOneAndUpdate(
        { _id: postid },
        { $pull: { comments: id } },
        { new: true }
      );
      if (!deletedComment) {
        return next(new AppError(NOT_FOUND, 404));
      }
      res.status(200).json({ deletedComment, updatedPost });
    } else {
      const deletedComment = await Comment.findOneAndDelete({
        _id: id,
        user: user.id,
      });
      const updatedPost = await Post.findOneAndUpdate(
        { _id: postid },
        { $pull: { comments: id } },
        { new: true }
      );
      if (!deletedComment) {
        return next(new AppError(UNAUTHORIZED_ACCESS, 401));
      }
      res.status(200).json({ deletedComment, updatedPost });
    }
  } catch (err) {
    return next(new AppError(FAILURE, 404));
  }
};

module.exports = {
  getAllComments,
  getSingleComment,
  addComment,
  editComment,
  deleteComment,
};
