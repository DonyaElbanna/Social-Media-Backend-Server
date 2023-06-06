const User = require("../models/user.model");
const AppError = require("../utils/Error");

const cloudinary = require("../utils/cloudinary");

// only user can edit their avatar
const uploadImg = async (req, res, next) => {
  const { id } = req.params;
  const { avatar } = req.body;
  const loggedUser = req.user;

  if (!avatar) {
    return next(new AppError("No picture provided", 404));
  } else if (loggedUser.id == id) {
    try {
      // Upload image to cloudinary
      const image = await cloudinary.uploader.upload(avatar);
      const editedUser = await User.findById(id);
      editedUser.avatar = image.secure_url;
      editedUser.cloudinary_id = image.public_id;
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
  uploadImg,
};
