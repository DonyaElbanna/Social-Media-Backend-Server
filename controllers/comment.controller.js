const getAllComments = (req, res) => {
  res.send("get all comments");
};

const getSingleComment = (req, res) => {
  res.send("get single comment");
};

const addComment = (req, res) => {
  res.send("add comment");
};

const editComment = (req, res) => {
  res.send("edit comment");
};

const deleteComment = (req, res) => {
  res.send("delete comment");
};

module.exports = {
  getAllComments,
  getSingleComment,
  addComment,
  editComment,
  deleteComment,
};
