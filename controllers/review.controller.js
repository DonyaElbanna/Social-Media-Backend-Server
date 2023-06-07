const Review = require("../models/review.model");
const AppError = require("../utils/Error");
const Post = require("../models/post.model");

const {
  NOT_FOUND,
  FAILURE,
  NOT_PROCESSED,
  UNAUTHORIZED_ACCESS,
} = require("../utils/namespace.util");

// getting all reviews on a specific post post
const getAllReviews = async (req, res, next) => {
  const { postid } = req.params;
  try {
    const reviews = await Review.find({ post: postid });
    if (reviews.length == 0) {
      return next(new AppError(NOT_FOUND, 404));
    }
    res.status(200).json({ reviews });
  } catch (err) {
    return next(new AppError(FAILURE, 404));
  }
};

const getSingleReview = async (req, res, next) => {
  const { postid, id } = req.params;
  try {
    const review = await Review.findOne({ _id: id, post: postid });
    if (!review) {
      return next(new AppError(NOT_FOUND, 404));
    }
    res.status(200).json({ review });
  } catch (err) {
    return next(new AppError(FAILURE, 404));
  }
};

const addReview = async (req, res, next) => {
  const { postid } = req.params;
  const user = req.user;
  const { review } = req.body;
  try {
    const post = await Post.find({ _id: postid });
    if (post.length == 0) {
      return next(new AppError(NOT_FOUND, 404));
    }
    if (!review) {
      return next(new AppError(NOT_PROCESSED, 400));
    }
    const newReview = await Review.create({
      review,
      post: postid,
      user: user.id,
    });
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postid },
      { $addToSet: { reviews: newReview._id } },
      { new: true }
    );
    res.status(201).json({ newReview, updatedPost });
  } catch (err) {
    return next(new AppError(FAILURE, 404));
  }
};

// only logged user can edit their own reviews
const editReview = async (req, res, next) => {
  const { postid, id } = req.params;
  const user = req.user;
  const { review } = req.body;
  if (!review) {
    return next(new AppError(NOT_PROCESSED, 400));
  }
  try {
    const editedReview = await Review.findOne({
      _id: id,
      post: postid,
      user: user.id,
    });
    editedReview.review = review;
    await editedReview.save();
    if (!editedReview) {
      return next(new AppError(UNAUTHORIZED_ACCESS, 401));
    }
    res.status(200).json({ editedReview });
  } catch (err) {
    return next(new AppError(FAILURE, 404));
  }
};

// comment's creator an delete their review on a post
const deleteReview = async (req, res, next) => {
  const { postid, id } = req.params;
  const user = req.user;

  const review = await Review.find({ _id: id, post: postid });
  if (review.length == 0) {
    return next(new AppError(NOT_FOUND, 404));
  }

  try {
    const deletedReview = await Review.findOneAndDelete({
      _id: id,
      user: user.id,
    });
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postid },
      { $pull: { reviews: id } },
      { new: true }
    );
    if (!deletedReview) {
      return next(new AppError(UNAUTHORIZED_ACCESS, 401));
    }
    res.status(200).json({ deletedReview, updatedPost });
  } catch (err) {
    return next(new AppError(FAILURE, 404));
  }
};

module.exports = {
  getAllReviews,
  getSingleReview,
  addReview,
  editReview,
  deleteReview,
};
