const express = require("express");
const { createRequest, getRequestsByCollection, deleteRequest } = require("../controllers/requestController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createRequest);
router.get("/:collectionId", authMiddleware, getRequestsByCollection);
router.delete("/:id", authMiddleware, deleteRequest);
router.patch("/:id/favorite", authMiddleware, async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.favorite = !request.favorite;
    await request.save();

    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
