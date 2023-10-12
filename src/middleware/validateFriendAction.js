const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const validateUser = async (req, res, next) => {
  const { friendId } = req.params;
  const token = req.header("Authorization");
  const decodedToken = jwt.verify(
    token.slice(7, token.length).trimLeft(),
    process.env.ACCESS_TOKEN_SECRET
  );
  const id = decodedToken.id;

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(friendId)
  ) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  if (id === friendId)
    return res.status(400).json({ error: "Cannot manage yourself" });

  const userA = await User.findById(id);
  const userB = await User.findById(friendId);

  if (!userA || !userB) {
    return res.status(404).json({ error: "One or both users not found" });
  }

  // Attach the user objects to the request for use in the controller function
  req.userA = userA;
  req.userB = userB;

  // Continue to the controller function
  next();
};

module.exports = validateUser;
