const User = require("../models/user.model");
const AppError = require("../utils/Error");
// const { config } = require("../config/default.config");
// const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  //! error if removed, why?
  if (user) {
    return next(new AppError("This email is already registered", 404));
  }
  const newUser = await User.create({ email, password });
  newUser.password = undefined;
  res.status(201).json(newUser);
};

module.exports = { signup };
