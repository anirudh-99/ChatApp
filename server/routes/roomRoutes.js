const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const roomController = require("../controllers/roomController");

//route for getting all room names
router.get("/", authController.protect, roomController.getAllRooms);

// route for creating new rooms
router.post("/", authController.protect, roomController.createRoom);

// route for getting all messages in a room
router.get(
  "/:roomId/messages",
  authController.protect,
  roomController.getMessagesInARoom
);

// route for adding a new message in a room
router.patch(
  "/:roomId/messages",
  authController.protect,
  roomController.addMessageToRoom
);

module.exports = router;
