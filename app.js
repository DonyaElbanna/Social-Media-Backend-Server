const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { config } = require("./config/default.config");
const port = config.server.port;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
// const
const verifyToken = require("./utils/tokenVerification");

// routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", verifyToken, postRoutes);
app.use("/post", verifyToken, commentRoutes);
app.use("/post", verifyToken, commentRoutes);

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
