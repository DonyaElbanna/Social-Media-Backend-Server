const User = require("../models/user.model");
const AppError = require("../utils/Error");
const config = require("../config/default.config").config;
const jwt = require("jsonwebtoken");

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  const loggedUser = await User.findOne({ email }).select("+password");
  if (!loggedUser) {
    return next(new AppError("Invalid sign in credentials", 404));
  }
  const isMatch = await loggedUser.checkPassword(password);

  if (!isMatch) {
    return next(new AppError("Invalid sign in credentials", 404));
  }
  loggedUser.password = undefined;

  const token = jwt.sign({ id: loggedUser.id }, config.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.send({ loggedUser, token });
};

module.exports = { signIn };
