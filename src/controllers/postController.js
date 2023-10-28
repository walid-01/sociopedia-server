const multer = require("multer");
const { upload } = require("../middleware/imageUpload");
const User = require("../models/User");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");

// Create
exports.createPost = async (req, res) => {
  upload.single("picture")(req, res, async (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ multerError: err.message });
    else if (err) return res.status(500).json({ multerError: err });

    try {
      const token = req.header("Authorization");
      const decodedId = jwt.verify(
        token.slice(7, token.length).trimLeft(),
        process.env.ACCESS_TOKEN_SECRET
      ).id;
      const user = await User.findById(decodedId);

      const newPost = new Post({
        userId: decodedId,
        firstName: user.firstName,
        lastName: user.lastName,
        description: req.body.description,
        picturePath: req.file.filename,
      });

      await newPost.save();

      // const post = await Post.find(); //1:28
      // return res.status(201).json(post);
      return res.status(201).json(newPost);
    } catch (err) {
      if (err.name === "ValidationError") {
        console.log({
          error: Object.values(err.errors).map((error) => error.message),
        });
        return res.status(400).json({
          error: Object.values(err.errors).map((error) => error.message),
        });
      }
      console.error(err);
      return res.status(500).json(err);
    }
  });
};

exports.getFeedPosts = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const decodedId = jwt.verify(
      token.slice(7, token.length).trimLeft(),
      process.env.ACCESS_TOKEN_SECRET
    ).id;
    const user = await User.findById(decodedId);

    const friendIds = user.friends
      .filter((friend) => friend.status === "friend")
      .map((friend) => friend.user);

    const feedPosts = await Post.find({ userId: { $in: friendIds } })
      .sort({ createdAt: -1 }) // Sort by most recent posts
      .populate("userId", "firstName lastName"); // Populate user information

    res.status(200).json(feedPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

exports.getUserPosts = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

exports.likePost = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

exports.dislikePost = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
