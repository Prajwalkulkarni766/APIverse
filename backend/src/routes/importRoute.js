const express = require("express");
const { importCollection, importRequest, importBoth } = require("../controllers/importController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/collection", authMiddleware, upload.single("file"), importCollection);
router.post("/request", authMiddleware, upload.single("file"), importRequest);
router.post("/both", authMiddleware, upload.single("file"), importBoth);

module.exports = router;
