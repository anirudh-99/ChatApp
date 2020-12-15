const mongoose = require("mongoose");

const room = mongoose.Schema({
  name: String,
});

module.exports = mongoose.model("room", room);
