const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  method: { type: String, required: true },
  url: { type: String, required: true },
  headers: { type: Object, default: {} },
  body: { type: Object, default: {} },
  favorite: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Request", requestSchema);
