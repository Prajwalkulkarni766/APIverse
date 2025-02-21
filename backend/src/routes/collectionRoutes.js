const express = require("express");
const {
  createCollection,
  getCollections,
  addRequestToCollection,
  deleteCollection,
  exportCollection,
  importCollection,
  duplicateCollection,
  shareCollection,
  searchAndFilterCollections
} = require("../controllers/collectionController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createCollection);
router.get("/", authMiddleware, getCollections);
router.post("/:collectionId/request", authMiddleware, addRequestToCollection);
router.delete("/:collectionId", authMiddleware, deleteCollection);
router.get("/:collectionId/export", authMiddleware, exportCollection);
router.post("/import", authMiddleware, upload.single("file"), importCollection);
router.post("/:collectionId/duplicate", authMiddleware, duplicateCollection);
router.post("/:collectionId/share", authMiddleware, shareCollection);
router.get("/search", authMiddleware, searchAndFilterCollections);

module.exports = router;
