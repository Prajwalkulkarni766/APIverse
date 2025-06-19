const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Collection" },
    name: { type: String, default: "New request" },
    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
      default: "GET",
    },
    url: {
      type: String,
      default: "https://jsonplaceholder.typicode.com/posts",
    },
    authType: {
      type: String,
      enum: ["No Auth", "Bearer Token", "Basic Auth", "OAuth 2.0"],
      default: "No Auth",
    },
    authToken: { type: String, default: "" },
    headers: { type: Array, default: [] },
    bodyType: {
      type: String,
      enum: ["none", "raw", "binary"],
      default: "none",
    },
    rawType: {
      type: String,
      enum: ["text", "json"],
      default: "text",
    },
    body: { type: Object, default: null },
    favorite: { type: Boolean, default: false },
    envId: { type: mongoose.Schema.Types.ObjectId, ref: "Environment" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
