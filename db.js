const mongoose = require("mongoose");
const { config } = require("./config/default.config");
const { DB_CONNECTED } = require("./utils/namespace.util");

mongoose
  .connect(config.db.uri)
  .then(() => {
    console.log(DB_CONNECTED);
  })
  .catch((error) => {
    console.log(error);
  });
