const User = require("../models/user.model");
const AppError = require("../utils/Error");

const cloudinary = require("../utils/cloudinary");

const {
  NOT_PROCESSED,
  UNAUTHORIZED_ACCESS,
  FAILURE,
} = require("../utils/namespace.util");

// only user can edit/add avatar
const uploadAvatar = async (req, res, next) => {
  const { id } = req.params;
  const { avatar } = req.body;
  const loggedUser = req.user;

  if (!avatar) {
    return next(new AppError(NOT_PROCESSED, 400));
  } else if (loggedUser.id == id) {
    try {
      // Upload image to cloudinary
      const image = await cloudinary.uploader.upload(avatar);
      const editedUser = await User.findById(id);
      editedUser.avatar = image.secure_url;
      editedUser.cloudinary_id = image.public_id;
      await editedUser.save();
      res.status(201).json({ editedUser });
    } catch (err) {
      return next(new AppError(FAILURE, 404));
    }
  } else {
    return next(new AppError(UNAUTHORIZED_ACCESS, 401));
  }
};

module.exports = {
  uploadAvatar,
};
