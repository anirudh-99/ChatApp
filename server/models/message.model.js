const mongoose = require("mongoose");

const message = mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  received: Boolean,
});

module.exports = mongoose.model("message", message);
