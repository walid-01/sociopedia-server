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
  sendFriendRequest
);

// Remove a friend
router.delete("/:id/remove-friend/:friendId", verifyToken, removeFriend);

// Cancel a pending friend request
router.delete(
  "/:id/cancel-friend-request/:friendId",
  verifyToken,
  cancelFriendRequest
);

// Accept a received friend request
router.post(
  "/:id/accept-friend-request/:friendId",
  verifyToken,
  acceptFriendRequest
);

// Delete a received friend request
router.delete(
  "/:id/delete-received-request/:requestId",
  verifyToken,
  deleteReceivedRequest
);

module.exports = router;
