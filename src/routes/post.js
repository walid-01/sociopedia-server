const { Router } = require("express");
const router = Router();

const {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  dislikePost,
} = require("../controllers/postController");

// Create
router.post("/create", createPost);

// Read
router.get("/", getFeedPosts);
router.get("/:userId/posts", getUserPosts);

// Update
router.patch("/:id/like", likePost);
router.patch("/:id/dislike", dislikePost);

module.exports = router;
