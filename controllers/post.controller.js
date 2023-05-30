const getAllPosts = (req, res) => {
  res.send("get all posts");
};

const getSinglePost = (req, res) => {
  res.send("get single post");
};

const addPost = (req, res) => {
  res.send("add post");
};

const editPost = (req, res) => {
  res.send("edit post");
};

const deletePost = (req, res) => {
  res.send("delete post");
};

module.exports = { getAllPosts, getSinglePost, addPost, editPost, deletePost };
