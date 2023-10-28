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
    const { userA, userB } = req;
    const id = userA._id.toString();
    const friendId = userB._id.toString();

    // Check if there is already an existing friend request or friendship
    const exisitingRelation = userA.friends.find(
      (request) => request.user.toString() === friendId
    );

    if (exisitingRelation) {
      if (exisitingRelation.status === "sent")
        return res.status(400).json({ error: "Friend request already sent" });
      else if (exisitingRelation.status === "friend")
        return res.status(400).json({ error: "You are already friends" });
      else if (exisitingRelation.status === "received")
        return res
          .status(400)
          .json({ error: "User already sent you a request" });
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

exports.removeRelation = async (req, res) => {
  try {
    const { userA, userB } = req;
    const id = userA._id.toString();
    const friendId = userB._id.toString();

    // Check if there is already an existing friend request or friendship
    const exisitingRelation = userA.friends.find(
      (request) => request.user.toString() === friendId
    );

    if (!exisitingRelation)
      return res.status(400).json({ error: "Already no relation with user" });

    // Remove userB from userA friends
    userA.friends = userA.friends.filter(
      (request) => request.user.toString() !== friendId
    );

    // Remove userA from userB friends
    userB.friends = userB.friends.filter(
      (request) => request.user.toString() !== id
    );

    // Save the changes to both users
    await userA.save();
    await userB.save();

    res.status(200).json({ message: "Removed successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { userA, userB } = req;
    const id = userA._id.toString();
    const friendId = userB._id.toString();

    // Check if there the status is "received"
    const exisitingRelation = userA.friends.find(
      (request) =>
        request.user.toString() === friendId && request.status === "received"
    );

    if (!exisitingRelation)
      return res.status(400).json({ error: "No request received from user" });

    // console.log(userA.friends);

    // Make userB friend with userA
    userA.friends.find((request) => {
      request.user.toString() === friendId && request.status === "received";
      request.status = "friend";
      request.createdAt = Date.now();
    });

    // Make userA friend with userB
    userB.friends.find((request) => {
      request.user.toString() === id && request.status === "sent";
      request.status = "friend";
      request.createdAt = Date.now();
    });

    // Save the changes to both users
    await userA.save();
    await userB.save();

    res.status(200).json({ message: "You are now friends" });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
