const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  nick: String,
  msg: String
});

module.exports = mongoose.model("Chat", chatSchema);
