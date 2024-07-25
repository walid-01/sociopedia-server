const multer = require("multer");
const path = require("path");

// Filter function to check if the file is an image
const imageFilter = (req, file, cb) => {
  const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExtension.substring(1))) {
    // If the file is an image, accept it
    cb(null, true);
  } else {
    // If the file is not an image, reject it with an error message
    cb(new Error("Only image files (jpg, jpeg, png, gif) are allowed"), false);
  }
};

// File Sotrage
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../../public/assets/posts")),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const postImgUpload = multer({
  storage,
  fileFilter: imageFilter, // Use the custom imageFilter
  // limits: {
  //   fileSize: 1024 * 1024,
  // },
});

module.exports = { postImgUpload };
