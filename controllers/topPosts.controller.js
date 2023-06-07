const Review = require("../models/review.model");
const AppError = require("../utils/Error");
const Post = require("../models/post.model");

// get highest rated posts
const getHighestRatedPosts = async (req, res, next) => {
  const topPosts = await Review.aggregate([
    {
      $group: {
        _id: "$post",
        avgRating: { $avg: "$review" },
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "_id",
        as: "post",
      },
    },
    { $sort: { avgRating: -1 } },
    { $limit: 5 },
  ]);
  res.status(200).json({ topPosts });
};

module.exports = {
  getHighestRatedPosts,
};
