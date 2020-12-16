const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  timestamp: { type: String, default: Date.now() },
});

const room = mongoose.Schema({
  name: { type: String, required: true },
  messages: [messageSchema],
});

module.exports = mongoose.model("room", room);

// /rooms/1dfk34kdf/messages
