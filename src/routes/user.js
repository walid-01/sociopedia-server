const { Router } = require("express");
const {
  getUser,
  getUserFrineds,
  addRemoveFriend,
} = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");

const router = Router();

// Read
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFrineds);

// Update
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

module.exports = router;
