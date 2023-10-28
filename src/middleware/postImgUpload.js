const multer = require("multer");
const path = require("path");

// Filter function to check if the file is an image
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

// File Sotrage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(path.join(__dirname, "../../public/assets/posts"));
    cb(null, path.join(__dirname, "../../public/assets/posts"));
  },
  filename: (req, file, cb) => {
    // console.log(Date.now() + path.extname(file.originalname));
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const postImgUpload = multer({ storage, fileFilter: imageFilter });

module.exports = { postImgUpload };
