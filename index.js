const app = require("./app");
// const http = require("http");
const mongoose = require("mongoose");
const config = require("./config/default.config").config;
const DB_CONNECTED = require("./utils/namespace.util").namespace.DB_CONNECTED;
const { ErrorHandler } = require("./lib/errorhandler.lib");

mongoose
  .connect(config.db.uri)
  .then(() => {
    console.log(DB_CONNECTED);
    // InitServer();
  })
  .catch((error) => {
    console.log(error);
  });
// const InitServer = () => {
//   http
//     .createServer(app)
//     .listen(config.server.port, () =>
//       console.log(`Server is running on port ${config.server.port}`)
//     );
// };
