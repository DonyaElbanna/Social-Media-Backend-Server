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
    minlength: 6,
    select: false,
  },
  avatar: {
    type: String,
    default: "https://shorturl.at/lorFV",
  },
  role: {
    type: String,
    enum: ["admin", "creator", "user"],
    default: "user",
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  // image is required
});

UserSchema.pre("save", async function () {
  const currentDocument = this;
  // console.log(currentDocument);
  const modifiedCheck = currentDocument.isModified("password");
  if (modifiedCheck) {
    const hashedPassword = await bcrypt.hash(currentDocument.password, 10);
    currentDocument.password = hashedPassword;
  }
});

UserSchema.methods.checkPassword = async function (password) {
  const currentDocument = this;
  // console.log(currentDocument)
  const isMatch = await bcrypt.compare(password, currentDocument.password);
  return isMatch;
};

// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const hash = bcrypt.hashSync(this.password, 10);
//   this.password = hash;
//   return next();
// });

// UserSchema.pre("findOneAndUpdate", async function (next) {
//   if (!this._update.password) return next();

//   const salt = await bcrypt.genSalt(10);

//   const hashed = await bcrypt.hash(this._update.password, salt);

//   this._update.password = hashed;

//   return next();
// });
// UserSchema.methods.comparePassword = async function (candidatePassword) {
//   const user = this;
//   return bcrypt.compare(candidatePassword, user.password).catch((err) => false);
// };

module.exports = mongoose.model("User", UserSchema);
