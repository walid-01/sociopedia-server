const multer = require("multer");
// const jwt = require("jsonwebtoken");

const { postImgUpload } = require("../middleware/postImgUpload");

// const User = require("../models/User");
const Post = require("../models/Post");

// CREATE
// Creating a post
exports.createPost = async (req, res) => {
  // Uploading post img using multer
  postImgUpload.single("picture")(req, res, async (err) => {
    // Handling multer errors
    if (err instanceof multer.MulterError)
      return res.status(400).json({ multerError: err.message });
    else if (err) return res.status(500).json({ multerError: err });

    try {
      const { user, userId } = req;
      if (!req.file)
        return res.status(400).json({ error: "missing post image" });

      // Creating the Post
      const newPost = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        description: req.body.description,
        picturePath: req.file.filename,
      });

      await newPost.save();

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

// READ
// Getting feed posts, feed posts are friends posts sorted by date
exports.getFeedPosts = async (req, res) => {
  try {
    const { user } = req;

    // getting array of friends
    const friendIds = user.friends
      .filter((friend) => friend.status === "friend")
      .map((friend) => friend.user);

    // getting posts of each friend and sorting them
    const feedPosts = await Post.find({ userId: { $in: friendIds } }).sort({
      createdAt: -1, // Sort by most recent posts
    });

    res.status(200).json(feedPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// Getting posts of a specific user
exports.getUserPosts = async (req, res) => {
  try {
    const feedPosts = await Post.find({ userId: req.params.userId }).sort({
      createdAt: -1, // Sort by most recent posts
    });

    return res.status(200).json(feedPosts);
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({ error: "Wrong id" });
    console.error(err);
    res.status(500).json({ error: err });
  }
};

// UPDATE
// Liking a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "No post found" });

    const { userId } = req;

    // If the current user already liked the post -> throw an error
    if (post.likes.includes(userId))
      return res.status(400).json({ error: "Already liked" });

    // Adding the current user to the post's likes
    post.likes.push(userId);
    await post.save();

    return res.status(200).json({ message: "Liked successfully" });
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({ error: "Wrong id" });
    console.error(err);
    res.status(500).json({ error: err });
  }
};

// Unliking a post
exports.dislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "No post found" });

    const { userId } = req;
    // If the current user already not liked the -> post throw an error
    if (!post.likes.includes(userId))
      return res.status(400).json({ error: "Already not liked" });

    // Removing the current user from the post's likes
    post.likes = post.likes.filter((user) => user._id.toString() !== userId);
    await post.save();

    return res.status(200).json({ message: "Unliked successfully" });
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({ error: "Wrong id" });
    console.error(err);
    res.status(500).json({ error: err });
  }
};
