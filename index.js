const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("./db");
const { config } = require("./config/default.config");
const port = config.server.port;

const loginRoute = require("./routes/login.route");
const signupRoute = require("./routes/signup.route");
const userRoute = require("./routes/user.route");
const avatarRoute = require("./routes/avatar.route");
const postRoute = require("./routes/post.route");
const commentRoute = require("./routes/comment.route");
const reviewRoute = require("./routes/review.route");
const verifyToken = require("./utils/tokenVerification");
const topPostsRoute = require("./routes/topPosts.route");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// routes
app.use("/login", loginRoute);
app.use("/signup", signupRoute);
app.use("/user", verifyToken, userRoute);
app.use("/user", verifyToken, avatarRoute);
app.use("/post", verifyToken, postRoute);
app.use("/post", verifyToken, commentRoute);
app.use("/post", verifyToken, reviewRoute);
app.use("/review", verifyToken, topPostsRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({
    status: statusCode,
    message: err?.message || "internal server error",
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
