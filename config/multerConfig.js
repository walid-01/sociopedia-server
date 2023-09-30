const multer = require("multer");

// File Sotrage
const storage = multer.diskStorage({
  destination: (req, res, cb) => cb(null, "../public/assests"),
  filename: (req, res, cb) => cb(null, file.originalname),
});

module.exports = storage;
