const bcrypt = require("bcrypt");
const multer = require("multer");
// const jwt = require("jsonwebtoken");

const { upload } = require("../config/multerConfig");
const User = require("../models/User");

// const ensureNotAuthenticated = (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     // User is not authenticated, proceed to the next middleware/route handler.
//     return next();
//   }

//   // User is authenticated, redirect them to /home.
//   res.status(500).json({
//     error:
//       "Redirecting to home is not implemented yet (redirecting because a user is already logged in)",
//   });
//   // res.redirect("/home");
// };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: "Must include an email" });
    if (!password)
      return res.status(400).json({ error: "Must include a password" });
    const userDB = await User.findOne({ email });
    if (!userDB) {
      console.log("No user with the specified email was found");
      return res
        .status(401)
        .json({ error: "No user with the specified email was found" });
    } else {
      const isPasswordValid = await bcrypt.compare(password, userDB.password);
      if (isPasswordValid) {
        console.log("Authenticated successfuly");
        return res.status(200).send(userDB);
      } else {
        console.log("Wrong password");
        return res.json({ error: "Wrong password" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

exports.register =
  ("/register",
  (req, res, next) => {
    // Handling Multer error
    upload.single("picturePath")(req, res, async (err) => {
      if (err instanceof multer.MulterError)
        return res.status(400).json({ error: err.message });
      else if (err) return res.status(400).json({ error: err.message });

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

        if (!password) {
          console.error("Missing password field");
          return res.status(400).json({ error: "Missing password field" });
        }

        const passwordHash = await bcrypt.hash(
          password,
          await bcrypt.genSalt()
        );

        const newUser = {
          firstName,
          lastName,
          friends,
          email,
          password: passwordHash,
          picturePath:
            req.file && req.file.fieldname === "picturePath"
              ? req.file.filename
              : "",
          location,
          occupation,
        };

        await User.create(newUser);
        return res.status(201).json(newUser);
      } catch (err) {
        if (err.code === 11000) {
          console.error("Email already exists");
          return res.status(400).json({ error: "Email already exists" });
        }

        if (err.name === "ValidationError") {
          console.error("Validation Error");
          return res.status(400).json({
            error: Object.values(err.errors).map((error) => error.message),
          });
        }

        console.error(err);
        return res.status(500).json({
          error: Object.values(err.errors).map((error) => error.message),
        });
      }
    });
  });
