const express = require("express");
const {
  exportCollection,
  exportRequests,
  exportBoth,
} = require("../controllers/exportController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/collection/:collectionId", authMiddleware, exportCollection);
router.get("/request/:collectionId", authMiddleware, exportRequests);
router.get("/both/:collectionId", authMiddleware, exportBoth);

module.exports = router;
