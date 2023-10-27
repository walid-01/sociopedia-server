const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");

const { upload } = require("../config/multerConfig");
const User = require("../models/User");

const login = async (req, res) => {
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
    console.error(err);
    res.status(500).json(err);
  }
};

const register = (req, res) => {
  // Handling Multer error
  upload.single("picture")(req, res, async (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ error: err.message });
    else if (err) return res.status(500).json({ error: err });

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
      if (err.code === 11000)
        return res.status(400).json({ error: "Email already exists" });

      if (err.name === "ValidationError")
        return res.status(400).json({
          error: Object.values(err.errors).map((error) => error.message),
        });

      console.error(err);
      return res.status(500).json({
        error: Object.values(err.errors).map((error) => error.message),
      });
    }
  });
};

module.exports = {
  register,
  login,
};
