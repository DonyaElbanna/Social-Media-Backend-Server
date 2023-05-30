const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;
const app = express();
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
// const adminRoutes = require("./routes/admin.route")
// const { config } = require("./config/default.config");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
const verifyToken = require("./utils/tokenVerification");

// routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", verifyToken, postRoutes);
app.use("/comment", commentRoutes);

// HANDLE 404
// app.use((req, res, next) => {
//   const error = new Error(NOT_FOUND);
//   error.status = 404;
//   next(error);
// });

// HANDLE GLOBAL ERROR
// app.use((error, req, res, next) => {
//   return res.status(error.status || 500).send({
//     error: {
//       message: error.message,
//     },
//   });
// });
// module.exports = app;

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({
    status: statusCode,
    message: err?.message || "internal server error",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
