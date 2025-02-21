const express = require("express");
const { executeRequest } = require("../controllers/executeController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, executeRequest);

module.exports = router;
