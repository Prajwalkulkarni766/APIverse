const express = require("express");
const {
  createRequest,
  getRequestsByCollection,
  deleteRequest,
  toggleFavorite,
  getRequestById,
  createBlankRequest,
  updateRequest,
} = require("../controllers/requestController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createRequest);
router.get("/:collectionId", authMiddleware, getRequestsByCollection);
router.get("/:id", authMiddleware, getRequestById);
router.post("/:collectionId", authMiddleware, createBlankRequest);
router.delete("/:id", authMiddleware, deleteRequest);
router.patch("/:id/favorite", authMiddleware, toggleFavorite);
router.patch("/:id/save", authMiddleware, updateRequest);

module.exports = router;
