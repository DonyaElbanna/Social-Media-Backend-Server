const Review = require("../models/review.model");
const AppError = require("../utils/Error");
const Post = require("../models/post.model");

// getting all reviews on a post
const getAllReviews = async (req, res, next) => {
  const { postid } = req.params;
  try {
    const reviews = await Review.find({ post: postid });
    if (reviews.length == 0) {
      return next(new AppError("review not found!", 404));
    }
    res.status(200).json({ reviews });
  } catch (err) {
    return next(new AppError("something went wrong!", 404));
  }
};

const getSingleReview = async (req, res, next) => {
  const { postid, id } = req.params;
  try {
    const review = await Review.findOne({ _id: id, post: postid });
    if (!review) {
      return next(new AppError("post/review not found!", 404));
    }
    res.status(200).json({ review });
  } catch (err) {
    return next(new AppError("something went wrong!", 404));
  }
};

const addReview = async (req, res, next) => {
  const { postid } = req.params;
  const user = req.user;
  const { review } = req.body;
  try {
    const post = await Post.find({ _id: postid });
    if (post.length == 0) {
      return next(new AppError("This post can't be found", 404));
    }
    if (!review) {
      return next(new AppError("A review can't be empty", 404));
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
    res.status(200).json({ newReview, updatedPost });
  } catch (err) {
    return next(new AppError("Something went wrong!", 404));
  }
};

// only logged user can edit their own reviews
const editReview = async (req, res, next) => {
  const { postid, id } = req.params;
  const user = req.user;
  const { review } = req.body;
  if (!review) {
    return next(new AppError("A review can't be empty", 404));
  }
  try {
    const editedReview = await Review.findOneAndUpdate(
      { _id: id, post: postid, user: user.id },
      { review },
      {
        new: true,
      }
    );
    if (!editedReview) {
      return next(new AppError("invalid token", 401));
    }
    res.status(200).json({ editedReview });
  } catch (err) {
    return next(new AppError("Something went wrong!", 404));
  }
};

// comment's creator an delete their review on a post
const deleteReview = async (req, res, next) => {
  const { postid, id } = req.params;
  const user = req.user;

  const review = await Review.find({ _id: id, post: postid });
  if (review.length == 0) {
    return next(new AppError("Review not found", 404));
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
      return next(new AppError("invalid token", 401));
    }
    res.status(200).json({ deletedReview, updatedPost });
    // }
  } catch (err) {
    return next(new AppError("Something went wrong!", 404));
  }
};

module.exports = {
  getAllReviews,
  getSingleReview,
  addReview,
  editReview,
  deleteReview,
};
