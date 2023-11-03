const { Router } = require("express");
const router = Router();
const validateUser = require("../middleware/validateUser");

const {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  dislikePost,
  addComment,
  removeComment,
} = require("../controllers/postController");

// Create
router.post("/create", validateUser, createPost);

// Read
router.get("/", validateUser, getFeedPosts);
router.get("/:userId/posts", getUserPosts);

// Update
router.patch("/:postId/like", validateUser, likePost);
router.patch("/:postId/dislike", validateUser, dislikePost);
router.patch("/:postId/comment", validateUser, addComment);
router.patch("/:postId/remove-comment", validateUser, removeComment);

module.exports = router;
