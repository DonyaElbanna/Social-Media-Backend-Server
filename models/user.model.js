const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    select: false,
  },
  avatar: {
    type: String,
    default: "https://shorturl.at/lorFV",
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  cloudinary_id: {
    type: String,
  },
});

UserSchema.pre("save", async function () {
  const currentDocument = this;
  const modifiedCheck = currentDocument.isModified("password");
  if (modifiedCheck) {
    const hashedPassword = await bcrypt.hash(currentDocument.password, 10);
    currentDocument.password = hashedPassword;
  }
});

UserSchema.methods.checkPassword = async function (password) {
  const currentDocument = this;
  const isMatch = await bcrypt.compare(password, currentDocument.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
