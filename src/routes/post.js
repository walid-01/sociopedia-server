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
router.post("/:postId/like", validateUser, likePost);
router.post("/:postId/dislike", validateUser, dislikePost);
router.post("/:postId/comment", validateUser, addComment);
router.post("/:postId/remove-comment", validateUser, removeComment);

module.exports = router;
