const { Router } = require("express");
const {
  getUser,
  getUserFrineds,
  sendFriendRequest,
  removeFriend,
  cancelFriendRequest,
  acceptFriendRequest,
  deleteReceivedRequest,
} = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const validateFriendAction = require("../middleware/validateFriendAction");

const router = Router();

// Read
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFrineds);

// // Update
// router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

// Friends Management
// Send a friend request
router.post(
  "/:id/send-friend-request/:friendId",
  verifyToken,
  validateFriendAction,
  sendFriendRequest
);

// Remove a friend
router.delete(
  "/:id/remove-friend/:friendId",
  verifyToken,
  validateFriendAction,
  removeFriend
);

// Accept a received friend request
router.post(
  "/:id/accept-friend-request/:friendId",
  verifyToken,
  validateFriendAction,
  acceptFriendRequest
);

// // Cancel a pending friend request
// router.delete(
//   "/:id/cancel-friend-request/:friendId",
//   verifyToken,
//   validateFriendAction,
//   cancelFriendRequest
// );

// // Delete a received friend request
// router.delete(
//   "/:id/delete-received-request/:requestId",
//   verifyToken,
//   validateFriendAction,
//   deleteReceivedRequest
// );

module.exports = router;
