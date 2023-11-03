const { Router } = require("express");
const router = Router();
const validateUser = require("../middleware/validateUser");

const {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  dislikePost,
} = require("../controllers/postController");

// Create
router.post("/create", validateUser, createPost);

// Read
router.get("/", validateUser, getFeedPosts);
router.get("/:userId/posts", getUserPosts);

// Update
router.patch("/:postId/like", validateUser, likePost);
router.patch("/:postId/dislike", validateUser, dislikePost);
//ADD Comment

module.exports = router;
