const User = require("../models/User");
const mongoose = require("mongoose");

// Read
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "No user found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getUserFrineds = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(id).populate(
      "friends",
      "_id firstName lastName occupation location picturePath"
    );

    if (!user) return res.status(404).json({ error: "No user found" });

    res.status(200).json(user.friends);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// Friends Management

exports.sendFriendRequest = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(friendId)
    ) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Check if the users with provided IDs exist
    const userA = await User.findById(id);
    const userB = await User.findById(friendId);

    if (!userA || !userB) {
      return res.status(404).json({ error: "One or both users not found" });
    }

    // Check if there is already an existing friend request or friendship
    const existingFriendRequest = userA.friends.find(
      (request) => request.user.toString() === friendId // && request.status === "sent"
    );

    if (existingFriendRequest) {
      return res.status(400).json({ error: "Friend request already sent" });
    }

    // Add friend request to User A's friends
    userA.friends.push({
      user: friendId,
      status: "sent",
    });

    // Add received friend request to User B's friends
    userB.friends.push({
      user: id,
      status: "received",
    });

    // Save the changes to both users
    await userA.save();
    await userB.save();

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const { id, friendId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(friendId)
    ) {
      return res.status(400).json({ error: "Invalid ID" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.cancelFriendRequest = async (req, res) => {
  try {
    const { id, friendId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(friendId)
    ) {
      return res.status(400).json({ error: "Invalid ID" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { id, friendId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(friendId)
    ) {
      return res.status(400).json({ error: "Invalid ID" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.deleteReceivedRequest = async (req, res) => {
  try {
    const { id, friendId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(friendId)
    ) {
      return res.status(400).json({ error: "Invalid ID" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
