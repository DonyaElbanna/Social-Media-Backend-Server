const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require("../utils/Error");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next(new AppError("No token is provided", 404));
  }
  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: id });
  if (!user) {
    return next(new AppError("invalid token", 404));
  }
  req.user = user;
  next();
};
