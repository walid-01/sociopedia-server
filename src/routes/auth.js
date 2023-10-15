const { Router } = require("express");
const { login, register } = require("../controllers/authController");

const router = Router();

const checkAuthentication = (req, res, next) => {
  const token = req.header("Authorization");
  if (token) {
    // User is authenticated, redirect to /home
    // return res.redirect('/home');
    return res
      .status(500)
      .json({ error: "Already logged in, Route /home not finished yet" });
  }

  // User is not authenticated, continue to the next middleware or route handler
  next();
};

router.post("/login", checkAuthentication, login);
router.post("/register", checkAuthentication, register);

module.exports = router;
