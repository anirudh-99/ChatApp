import mongoose from "mongoose";

const room = mongoose.Schema({
  name: String,
});

export default mongoose.model("room", room);
