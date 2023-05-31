const User = require("../models/user.model");
const AppError = require("../utils/Error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new AppError("Something went wrong", 404));
  }
  res.send(users);
};

const getSingleUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    var user = await User.findById(id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
  } catch (err) {
    return next(new AppError("User not found", 404));
  }
  res.send(user);
};

const addUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  //! error if removed, why?
  if (user) {
    return next(new AppError("This email is already registered", 404));
  }
  const newUser = await User.create({ email, password });
  newUser.password = undefined;
  res.send(newUser);
};

const editUser = async (req, res, next) => {
  const { id } = req.params;
  const { email, password } = req.body;
  const loggedUser = req.user;

  if (loggedUser.id == id) {
    try {
      const editedUser = await User.findById(id).select("+password");
      // if (!editedUser) {
      //   return next(new AppError("User not found", 404));
      // }
      if (editedUser.email !== email) {
        editedUser.email = email;
      }
      if (password.length < 6 || password.length > 20) {
        return next(
          new AppError("Password has to be 6 to 20 characters long", 404)
        );
      }
      if (!(await bcrypt.compare(password, editedUser.password))) {
        editedUser.password = password;
      }
      await editedUser.save();
      editedUser.password = undefined;
      res.send(editedUser);
    } catch (err) {
      return next(new AppError("Something went wrong", 404));
    }
  } else {
    return next(new AppError("invalid token", 404));
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const loggedUser = req.user;

  try {
    if (loggedUser.position == "admin" || loggedUser.id == id) {
      const deletedUser = await User.findByIdAndDelete(id);
      res.send(deletedUser);
    } else {
      return next(new AppError("invalid token", 404));
    }
  } catch (err) {
    return next(new AppError("User not found", 404));
  }
};

module.exports = { getAllUsers, getSingleUser, addUser, editUser, deleteUser };
