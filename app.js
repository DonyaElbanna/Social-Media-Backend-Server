const express = require("express");
const bodyParser = require("body-parser");
require("body-parser-xml")(bodyParser);
const app = express();
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const attractionRoutes = require("./routes/attractions.route");
const paymentRoutes = require("./routes/payment.route");
const adminRoutes = require("./routes/admin.route")
const { config } = require("./config/default.config");
const cookieParser = require("cookie-parser");
const path = require("path");
// HANLDE CORS
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin","http://localhost:3000");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    return res.status(200).json({});
  }

  next();
});

// EXPRESS FEATURES AND SETTINGS
app.use(cookieParser(config.server.cookie.secret,{
  SameSite:"none"
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.xml());
app.disable("x-powered-by");
// ROUTES
app.use("/v1/users", userRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/attraction", attractionRoutes);
app.use("/v1/payment", paymentRoutes);
app.use("/v1/admin", adminRoutes);
app.get('/',(req,res)=>{
  res.json({
    status:200,
    success:true,
    message :'Backend api running success 🚀🚀 pdf !!'
  })
})
app.use("/v1/images", express.static(path.join(__dirname, "images")));
// HANDLE 404
app.use((req, res, next) => {
  const error = new Error(NOT_FOUND);
  error.status = 404;
  next(error); 
});
// HANDLE GLOBAL ERROR
app.use((error, req, res, next) => {
  return res.status(error.status || 500).send({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;