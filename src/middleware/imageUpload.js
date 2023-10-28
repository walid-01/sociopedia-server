const multer = require("multer");
const path = require("path");

// Filter function to check if the file is an image
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

// File Sotrage
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(path.join(__dirname, "../../public/assets"));
    cb(null, path.join(__dirname, "../../public/assets"));
  },
  filename: (req, file, cb) => {
    console.log(Date.now() + path.extname(file.originalname));
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File Sotrage
// const postStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     console.log(path.join(__dirname, "../../public/assets/posts"));
//     cb(null, path.join(__dirname, "../../public/assets/posts"));
//   },
//   filename: (req, file, cb) => {
//     console.log(Date.now() + path.extname(file.originalname));
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

const avatarUpload = multer({ avatarStorage }); //, fileFilter: imageFilter
// const postsUpload = multer({ postStorage, fileFilter: imageFilter });

module.exports = { avatarUpload }; //postsUpload
