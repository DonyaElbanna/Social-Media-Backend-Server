const multer = require("multer");
const path = require("path");
const AppError = require("../utils/Error");
const { UNSUPPORTED } = require("../utils/namespace.util");

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new AppError(UNSUPPORTED), 415);
      return;
    }
    cb(null, true);
  },
});
