const User = require("../models/User");

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "No user found" });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getUserFrineds = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.addRemoveFriend = (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
