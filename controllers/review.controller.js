const Review = require("../models/review.model");
const AppError = require("../utils/Error");
const Post = require("../models/post.model");

const getAllReviews = async (req, res, next) => {
  const { postid } = req.params;
  try {
    const reviews = await Comment.find({ post: postid });
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
};

// only logged user can edit their own comments
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

const deleteReview = async (req, res, next) => {
  const { postid, id } = req.params;
  const user = req.user;
  try {
    // if (user.role == "admin") {
    //   const deletedReview = await Review.findOneAndDelete({
    //     _id: id,
    //     post: postid,
    //   });
    //   if (!deletedReview) {
    //     return next(new AppError("Review not found", 404));
    //   }
    //   res.status(200).json({ deletedReview });
    // } else {
    const deletedReview = await Review.findOneAndDelete({
      _id: id,
      user: user.id,
    });
    if (!deletedReview) {
      return next(new AppError("invalid token", 401));
    }
    res.status(200).json({ deletedReview });
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
