const multer = require("multer");
const jwt = require("jsonwebtoken");

const { postImgUpload } = require("../middleware/postImgUpload");

const User = require("../models/User");
const Post = require("../models/Post");

// Create
exports.createPost = async (req, res) => {
  postImgUpload.single("picture")(req, res, async (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ multerError: err.message });
    else if (err) return res.status(500).json({ multerError: err });

    try {
      const token = req.header("Authorization");
      const decodedId = jwt.verify(
        token.slice(7, token.length),
        process.env.ACCESS_TOKEN_SECRET
      ).id;
      const user = await User.findById(decodedId);

      const newPost = new Post({
        userId: decodedId,
        firstName: user.firstName,
        lastName: user.lastName,
        description: req.body.description,
        picutrePath: req.file.filename,
      });

      await newPost.save();

      // const post = await Post.find(); //01:28
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
      token.slice(7, token.length),
      process.env.ACCESS_TOKEN_SECRET
    ).id;
    const user = await User.findById(decodedId);

    const friendIds = user.friends
      .filter((friend) => friend.status === "friend")
      .map((friend) => friend.user);

    const feedPosts = await Post.find({ userId: { $in: friendIds } }).sort({
      createdAt: -1, // Sort by most recent posts
    });

    res.status(200).json(feedPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    // const { userId } = req.params;
    // const user = await User.findById(userId);

    const feedPosts = await Post.find({ userId: req.params.userId }).sort({
      createdAt: -1, // Sort by most recent posts
    });

    return res.status(200).json(feedPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    const token = req.header("Authorization");
    const decodedId = jwt.verify(
      token.slice(7, token.length),
      process.env.ACCESS_TOKEN_SECRET
    ).id;

    if (post.likes.includes(decodedId))
      return res.status(400).json({ error: "Already liked" });

    post.likes.push(decodedId);
    await post.save();

    return res.status(200).json({ message: "Liked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

exports.dislikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    const token = req.header("Authorization");
    const decodedId = jwt.verify(
      token.slice(7, token.length),
      process.env.ACCESS_TOKEN_SECRET
    ).id;

    if (!post.likes.includes(decodedId))
      return res.status(400).json({ error: "Already not liked" });

    post.likes = post.likes.filter((user) => user._id.toString() !== decodedId);
    await post.save();

    return res.status(200).json({ message: "Unliked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
