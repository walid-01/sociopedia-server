// const multer = require("multer");
// const jwt = require("jsonwebtoken");

const { postImgUpload } = require("../middleware/postImgUpload");

// const User = require("../models/User");
const Post = require("../models/Post");

// CREATE
// Creating a post
exports.createPost = async (req, res, next) => {
  // Uploading post img using multer
  postImgUpload.single("picture")(req, res, async (err) => {
    // Handling Multer error
    if (err) return res.status(400).json({ error: err.message });

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
      return next(err);
    }
  });
};

// READ
// Getting feed posts, feed posts are friends posts sorted by date
exports.getFeedPosts = async (req, res, next) => {
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
    return next(err);
  }
};

// Getting posts of a specific user
exports.getUserPosts = async (req, res, next) => {
  try {
    const feedPosts = await Post.find({ userId: req.params.userId }).sort({
      createdAt: -1, // Sort by most recent posts
    });

    return res.status(200).json(feedPosts);
  } catch (err) {
    return next(err);
  }
};

// UPDATE
// Liking a post
exports.likePost = async (req, res, next) => {
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
    return next(err);
  }
};

// Unliking a post
exports.dislikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "No post found" });

    const { userId } = req;
    // If the current user already not liked the -> post throw an error
    if (!post.likes.includes(userId))
      return res.status(400).json({ error: "Already not liked" });

    // Removing the current user from the post's likes
    post.likes.filter((user) => user._id.toString() !== userId);
    await post.save();

    return res.status(200).json({ message: "Unliked successfully" });
  } catch (err) {
    return next(err);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "No post found" });

    const { comment } = req.body;
    if (!comment)
      return res.status(400).json({ error: "Comment field can't be empty" });

    const { userId } = req;
    post.comments.push({ user: userId, text: comment });
    await post.save();

    res.status(201).json({ message: "Commented successfully" });
  } catch (err) {
    return next(err);
  }
};

exports.removeComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "No post found" });

    const { commentId } = req.body;
    if (!commentId)
      return res.status(400).json({ error: "Must include commentId" });

    // Getting comment index
    const commentIndex = post.comments.findIndex(
      (comment) => comment._id == commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const { userId } = req;

    // Only comment owner can delete the comment
    if (post.comments[commentIndex].user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to remove this comment" });
    }

    // Remove the comment from the post's comments array
    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(200).json({ message: "Comment removed successfully" });
  } catch (err) {
    return next(err);
  }
};
