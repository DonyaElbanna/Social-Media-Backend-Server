const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require("../utils/Error");
const { config } = require("../config/default.config");
const {
  NO_TOKEN,
  UNAUTHORIZED_ACCESS,
  INVALID_TOKEN,
} = require("../utils/namespace.util");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(new AppError(NO_TOKEN, 401));
    }
    const { id } = jwt.verify(token, config.server.token.secret);

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError(UNAUTHORIZED_ACCESS, 401));
    }
    req.user = user;
    next();
  } catch (err) {
    return next(new AppError(INVALID_TOKEN, 401));
  }
};
