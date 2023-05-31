const User = require("../models/user.model");
const AppError = require("../utils/Error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new AppError("Something went wrong", 404));
  }
  res.status(200).json({ users });
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
  res.status(200).json({ user });
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
  res.status(201).json(newUser);
};

// only logged user can edit their info
const editUser = async (req, res, next) => {
  const { id } = req.params;
  const { email, password } = req.body;
  const loggedUser = req.user;

  if (loggedUser.id == id) {
    try {
      const editedUser = await User.findById(id).select("+password");
      if (editedUser.email !== email) {
        editedUser.email = email;
      }
      if (!(await bcrypt.compare(password, editedUser.password))) {
        editedUser.password = password;
      }
      await editedUser.save();
      editedUser.password = undefined;
      res.status(200).json({ editedUser });
    } catch (err) {
      return next(new AppError("Something went wrong", 404));
    }
  } else {
    return next(new AppError("invalid token", 404));
  }
};

// only admin or logged user can delete the user
const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const loggedUser = req.user;

  try {
    if (loggedUser.role == "admin" || loggedUser.id == id) {
      const deletedUser = await User.findByIdAndDelete(id);
      res.status(200).json({ deletedUser });
    } else {
      return next(new AppError("invalid token", 404));
    }
  } catch (err) {
    return next(new AppError("User not found", 404));
  }
};

// only user can edit their avatar
const editAvatar = async (req, res, next) => {
  const { id } = req.params;
  const { avatar } = req.body;
  const loggedUser = req.user;
  if (!avatar) {
    return next(new AppError("No picture provided", 404));
  } else if (loggedUser.id == id) {
    try {
      const editedUser = await User.findById(id);
      if (editedUser.avatar !== avatar) {
        editedUser.avatar = avatar;
      }
      await editedUser.save();
      res.status(200).json({ editedUser });
    } catch (err) {
      return next(new AppError("Something went wrong", 404));
    }
  } else {
    return next(new AppError("invalid token", 404));
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  addUser,
  editUser,
  deleteUser,
  editAvatar,
};
