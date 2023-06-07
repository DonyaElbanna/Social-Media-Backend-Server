const express = require("express");
const router = express.Router();
const { getHighestRatedPosts } = require("../controllers/topPosts.controller");

router.get("/", getHighestRatedPosts);

module.exports = router;
