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
  searchAndFilterCollections,
  getCollectionsName,
  getCollectionById,
  getCollectionRequestName,
  updateTheCollection,
} = require("../controllers/collectionController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getCollections);
router.get("/collection-name", authMiddleware, getCollectionsName);
router.get("/:collectionId", authMiddleware, getCollectionById);
router.get("/collection-request-name/:collectionId", authMiddleware, getCollectionRequestName);
router.get("/:collectionId/export", authMiddleware, exportCollection);
router.get("/search", authMiddleware, searchAndFilterCollections);
router.post("/", authMiddleware, createCollection);
router.post("/:collectionId/request", authMiddleware, addRequestToCollection);
router.post("/import", authMiddleware, upload.single("file"), importCollection);
router.post("/:collectionId/duplicate", authMiddleware, duplicateCollection);
router.post("/:collectionId/share", authMiddleware, shareCollection);
router.put("/:collectionId", authMiddleware, updateTheCollection);
router.delete("/:collectionId", authMiddleware, deleteCollection);

module.exports = router;
