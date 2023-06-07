const User = require("../models/user.model");
const AppError = require("../utils/Error");
const { config } = require("../config/default.config");
const jwt = require("jsonwebtoken");

const {
  INVALID_CREDENTIALS,
  NO_USER_FOUND,
} = require("../utils/namespace.util");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const loggedUser = await User.findOne({ email }).select("+password");
  if (!loggedUser) {
    return next(new AppError(NO_USER_FOUND, 404));
  }

  const isMatch = await loggedUser.checkPassword(password);
  if (!isMatch) {
    return next(new AppError(INVALID_CREDENTIALS, 401));
  }

  loggedUser.password = undefined;

  const token = jwt.sign(
    { id: loggedUser.id, role: loggedUser.role },
    config.server.token.secret,
    {
      expiresIn: "1d",
    }
  );

  res.status(200).json({ loggedUser, token });
};

module.exports = { login };
