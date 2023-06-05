const express = require("express");
const router = express.Router();
const {
  getAllReviews,
  getSingleReview,
  addReview,
  editReview,
  deleteReview,
} = require("../controllers/review.controller");

router.get("/:postid/review", getAllReviews);

router.get("/:postid/review/:id", getSingleReview);

router.post("/:postid/review", addReview);

router.patch("/:postid/review/:id", editReview);

router.delete("/:postid/review/:id", deleteReview);

module.exports = router;
