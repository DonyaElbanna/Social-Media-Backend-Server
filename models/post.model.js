const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  post: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    // required: true,
  },
});

module.exports = mongoose.model("Post", PostSchema);
