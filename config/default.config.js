const dotenv = require("dotenv");
dotenv.config();
const env = process.env.NODE_ENV?.trimEnd();
const DB_OPTIONS = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  socketTimeoutMS: 30000,
  keepAlive: true,
  autoIndex: true,
  retryWrites: true,
};
const DB_USERNANE = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_LOCAL_HOST = process.env.DB_LOCAL_HOST;
const DB_LOCAL_PROTOCOL = process.env.DB_LOCAL_PROTOCOL;
const DB_LIVE_HOST = process.env.DB_LIVE_HOST;
const DB_LIVE_PROTOCOL = process.env.DB_LIVE_PROTOCOL;
const DB_URI =
  env === "production"
    ? `${DB_LIVE_PROTOCOL}${DB_USERNANE}:${DB_PASSWORD}@${DB_LIVE_HOST}/${DB_NAME}`
    : `${DB_LOCAL_PROTOCOL}${DB_LOCAL_HOST}/${DB_NAME}`;
const DB = {
  username: DB_USERNANE,
  password: DB_PASSWORD,
  options: DB_OPTIONS,
  uri: DB_URI,
};

//server
const SERVER_PORT = process.env.SERVER_PORT || 9999;
const SERVER_CORS_ORIGIN = process.env.SERVER_CORS_ORIGIN || "*";
const SERVER_TOKEN_SECRET =process.env.SERVER_TOKEN_SECRET || "somesupersecret";
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "error-404";
const SERVER_COOKIE_SECRET = process.env.SERVER_COOKIE_SECRET || "secret";
const SERVER_COOKIE_DOMAIN = process.env.SERVER_COOKIE_DOMAIN || "localhost";
const SERVER = {
  port: SERVER_PORT,
  token: {
    issuer: SERVER_TOKEN_ISSUER,
    secret: SERVER_TOKEN_SECRET,
  },
  cookie: {
    secret: SERVER_COOKIE_SECRET,
    domain: SERVER_COOKIE_DOMAIN,
  },
  cors: {
    origin: SERVER_CORS_ORIGIN,
  },
};
//url
const CLIENT_URI = process.env.CLIENT_URI || "http://localhost:3000";

const CLIENT = {
  uri: CLIENT_URI,
};

//NODEMAILER

const NODEMAILER_HOST = process.env.NODEMAILER_HOST || "smtp.ethereal.email";
const NODEMAILER_PORT = process.env.NODEMAILER_PORT || 587;
const NODEMAILER_SECURE = process.env.NODEMAILER_SECURE || "false";
const NODEMAILER_AUTH_USER = process.env.NODEMAILER_AUTH_USER;
const NODEMAILER_AUTH_PASSWORD = process.env.NODEMAILER_AUTH_PASSWORD;

const NODEMAILER = {
  host: NODEMAILER_HOST,
  port: NODEMAILER_PORT,
  secure: NODEMAILER_SECURE === "true" ? true : false,
  user: NODEMAILER_AUTH_USER,
  password: NODEMAILER_AUTH_PASSWORD,
}; 

// EXPORT VARIABLES
exports.config = {
  db: DB,
  server: SERVER,
  nodemailer: NODEMAILER,
  client: CLIENT,
};
