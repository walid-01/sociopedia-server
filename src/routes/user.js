const { Router } = require("express");
const {
  getUser,
  getUserFrineds,
  sendFriendRequest,
  removeRelation,
  acceptFriendRequest,
  getAllUsers,
} = require("../controllers/userController");
const validateFriendAction = require("../middleware/validateFriendAction");

const router = Router();

// Read
router.get("/all", getAllUsers);
router.get("/:id", getUser);
router.get("/:id/friends", getUserFrineds);

// Friends Management
// Send a friend request
router.post(
  "/send-friend-request/:friendId",
  validateFriendAction,
  sendFriendRequest
);

// Remove a friend
router.delete(
  "/remove-relation/:friendId",
  validateFriendAction,
  removeRelation
);

// Accept a received friend request
router.post(
  "/accept-friend-request/:friendId",
  validateFriendAction,
  acceptFriendRequest
);

module.exports = router;
