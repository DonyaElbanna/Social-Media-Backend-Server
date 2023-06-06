const User = require("../models/user.model");
const AppError = require("../utils/Error");

const { DUPLICATE_USER } = require("../utils/namespace.util");

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(new AppError(DUPLICATE_USER, 409));
  }
  const newUser = await User.create({ email, password });
  newUser.password = undefined;
  res.status(201).json(newUser);
};

module.exports = { signup };
