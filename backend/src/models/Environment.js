const mongoose = require("mongoose");

const environmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  variables: [
    {
      variable: { type: String, required: true },
      value: { type: String, required: true },
    }
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Environment", environmentSchema);
