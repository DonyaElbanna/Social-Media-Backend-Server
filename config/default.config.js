const dotenv = require("dotenv");
dotenv.config();

// db
const DB_USERNANE = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_URI = process.env.DB_URL;
const DB_OPTIONS = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  socketTimeoutMS: 30000,
  keepAlive: true,
  autoIndex: true,
  retryWrites: true,
};

const DB = {
  username: DB_USERNANE,
  password: DB_PASSWORD,
  options: DB_OPTIONS,
  uri: DB_URI,
};

//server
const SERVER_PORT = process.env.SERVER_PORT || 9999;
const SERVER_TOKEN_SECRET =
  process.env.SERVER_TOKEN_SECRET || "somesupersecret";

const SERVER = {
  port: SERVER_PORT,
  token: {
    secret: SERVER_TOKEN_SECRET,
  },
};

// EXPORT VARIABLES
exports.config = {
  db: DB,
  server: SERVER,
};
