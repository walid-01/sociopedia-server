const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");

const { avatarImgUpload } = require("../middleware/avatarImgUpload");

const User = require("../models/User");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: "No email field" });
    if (!password) return res.status(400).json({ error: "No password field" });

    const userDB = await User.findOne({ email });
    if (!userDB)
      return res
        .status(401)
        .json({ error: "No user with the specified email was found" });

    const isPasswordValid = await bcrypt.compare(password, userDB.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Wrong password" });

    const token = jwt.sign({ id: userDB._id }, process.env.ACCESS_TOKEN_SECRET);

    delete userDB.password;
    return res.status(200).json({ token, userDB });
  } catch (err) {
    return next(err);
  }
};

const register = (req, res, next) => {
  avatarImgUpload.single("picture")(req, res, async (err) => {
    // Handling Multer error
    if (err) return res.status(400).json({ error: err.message });

    try {
      const {
        firstName,
        lastName,
        friends,
        email,
        password,
        location,
        occupation,
      } = req.body;

      if (!password)
        return res.status(400).json({ error: "Missing password field" });

      const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

      // console.log(req.file);
      // console.log(req.file.fieldname);

      const newUser = {
        firstName,
        lastName,
        friends,
        email,
        password: passwordHash,
        picturePath:
          req.file && req.file.fieldname === "picture" ? req.file.filename : "",
        location,
        occupation,
      };

      await User.create(newUser);

      const userDB = await User.findOne({ email });
      const token = jwt.sign(
        { id: userDB._id },
        process.env.ACCESS_TOKEN_SECRET
      );

      return res.status(201).json({ token, userDB });
    } catch (err) {
      return next(err);
    }
  });
};

module.exports = {
  register,
  login,
};
