const express = require("express");
const { getHistory, deleteHistory, searchHistory, deleteAllHistory, createHistory } = require("../controllers/historyController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getHistory);
router.delete("/:id", authMiddleware, deleteHistory);
router.delete("/", deleteAllHistory);
router.get("/search", authMiddleware, searchHistory);
router.post("/", authMiddleware, createHistory);

module.exports = router;
