const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    requests: [
      {
        method: { type: String, required: true },
        url: { type: String, required: true },
        headers: { type: Object, default: {} },
        body: { type: mongoose.Schema.Types.Mixed, default: null },
      },
    ],
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", CollectionSchema);
