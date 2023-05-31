const Comment = require("../models/comment.model");
const AppError = require("../utils/Error");

const getAllComments = async (req, res, next) => {
  const { postid } = req.params;
  try {
    const comments = await Comment.find({ post: postid });
    if (comments.length == 0) {
      return next(new AppError("post not found!", 404));
    }
    res.status(200).json({ comments });
  } catch (err) {
    return next(new AppError("something went wrong!", 404));
  }
};

const getSingleComment = async (req, res, next) => {
  const { postid, id } = req.params;
  try {
    const comment = await Comment.findOne({ _id: id, post: postid });
    if (!comment) {
      return next(new AppError("post/comment not found!", 404));
    }
    res.status(200).json({ comment });
  } catch (err) {
    return next(new AppError("something went wrong!", 404));
  }
};

const addComment = async (req, res, next) => {
  const { postid } = req.params;
  const user = req.user;
  const { comment } = req.body;
  if (!comment) {
    return next(new AppError("A comment can't be empty", 404));
  }
  const newComment = await Comment.create({
    comment,
    post: postid,
    user: user.id,
  });
  res.status(200).send(newComment);
};

// only logged user can edit their own comments
const editComment = async (req, res, next) => {
  const { postid, id } = req.params;
  const user = req.user;
  const { comment } = req.body;
  if (!comment) {
    return next(new AppError("A comment can't be empty", 404));
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
      return next(new AppError("invalid token", 401));
    }
    res.status(200).json({ editedComment });
  } catch (err) {
    return next(new AppError("Something went wrong!", 404));
  }
};

const deleteComment = async (req, res, next) => {
  const { postid, id } = req.params;
  const user = req.user;
  try {
    if (user.role == "admin") {
      const deletedComment = await Comment.findOneAndDelete({
        _id: id,
        post: postid,
      });
      if (!deletedComment) {
        return next(new AppError("Comment not found", 404));
      }
      res.status(200).json({ deletedComment });
    } else {
      const deletedComment = await Comment.findOneAndDelete({
        _id: id,
        user: user.id,
      });
      if (!deletedComment) {
        return next(new AppError("invalid token", 401));
      }
      res.status(200).json({ deletedComment });
    }
  } catch (err) {
    return next(new AppError("Something went wrong!", 404));
  }
};

module.exports = {
  getAllComments,
  getSingleComment,
  addComment,
  editComment,
  deleteComment,
};
