const { Router } = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { storage } = require("../config/multerConfig");
const User = require("../models/User");

const router = Router();
const upload = multer({ storage });

// Register User
router.post("/register", upload.single("picture"), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      friends,
      email,
      password,
      picturePath,
      location,
      occupation,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

    const newUser = {
      firstName,
      lastName,
      friends,
      email,
      password: passwordHash,
      picturePath,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000), // These will be random numbers for now
      impressions: Math.floor(Math.random() * 1000),
    };

    await User.create(newUser);
    res.status(201).send(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
