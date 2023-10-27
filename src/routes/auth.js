const { Router } = require("express");
const { login, register } = require("../controllers/authController");
// const { upload } = require("../config/multerConfig");

const router = Router();

router.post("/login", login);
router.post("/register", register); //upload.single("picture"),

module.exports = router;
