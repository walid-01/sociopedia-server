const jwt = require("jsonwebtoken");
const User = require("../models/User");

const validateUser = async (req, res, next) => {
  const token = req.header("Authorization");
  const decodedId = jwt.verify(
    token.slice(7, token.length),
    process.env.ACCESS_TOKEN_SECRET
  ).id;

  const user = await User.findById(decodedId);
  if (!user)
    return res
      .status(404)
      .json({ error: "No user found (error with the token)" });

  req.userId = decodedId;
  req.user = user;

  // Continue to the controller function
  next();
};

module.exports = validateUser;
