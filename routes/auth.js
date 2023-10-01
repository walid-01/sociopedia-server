const { Router } = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
// const jwt = require("jsonwebtoken");

const { upload } = require("../config/multerConfig");
const User = require("../models/User");

const router = Router();

// Register User
// router.post("/register", upload.single("picturePath"), async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       friends,
//       email,
//       password,
//       location,
//       occupation,
//     } = req.body;

//     // console.log("-------------------------->", req.file);

//     if (!password) {
//       console.error("Missing password field");
//       return res.status(400).json({ error: ["Missing password field"] });
//     }

//     const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

//     const newUser = {
//       firstName,
//       lastName,
//       friends,
//       email,
//       password: passwordHash,
//       picturePath:
//         req.file && req.file.fieldname === "picturePath"
//           ? req.file.filename
//           : "",
//       location,
//       occupation,
//       // viewedProfile and impressions will be set to 0 at the beginning but functionality will not be implemented yet
//     };

//     await User.create(newUser);
//     return res.status(201).json(newUser);
//   } catch (err) {
//     if (err.code === 11000) {
//       console.error("Email already exists");
//       return res.status(400).json({ error: ["Email already exists"] });
//     }

//     if (err.name === "ValidationError") {
//       console.error("Validation Error");
//       return res.status(400).json({
//         error: Object.values(err.errors).map((error) => error.message),
//       });
//     }

//     console.error(err);
//     return res.status(500).json({
//       error: Object.values(err.errors).map((error) => error.message),
//     });
//   }
// });

router.post("/register", (req, res, next) => {
  // Handle the Multer error
  upload.single("picturePath")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // Handle Multer error here, e.g., send a specific error response
      return res
        .status(400)
        .json({ error: "Invalid field name for file upload" });
    } else if (err) {
      // Handle other non-Multer errors
      return res.status(500).json({ error: "Internal server error" });
    }

    // Continue processing if the field name is correct
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
        return res.status(400).json({ error: ["Missing password field"] });
      }

      const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

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
        return res.status(400).json({ error: ["Email already exists"] });
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

module.exports = router;
