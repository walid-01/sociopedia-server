const { Router } = require("express");
const {
  getUser,
  getUserFrineds,
  sendFriendRequest,
  removeRelation,
  acceptFriendRequest,
} = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const validateFriendAction = require("../middleware/validateFriendAction");

const router = Router();

// Read
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFrineds);

// Friends Management
// Send a friend request
router.post(
  "/send-friend-request/:friendId",
  verifyToken,
  validateFriendAction,
  sendFriendRequest
);

// Remove a friend
router.delete(
  "/remove-relation/:friendId",
  verifyToken,
  validateFriendAction,
  removeRelation
);

// Accept a received friend request
router.post(
  "/accept-friend-request/:friendId",
  verifyToken,
  validateFriendAction,
  acceptFriendRequest
);

module.exports = router;
