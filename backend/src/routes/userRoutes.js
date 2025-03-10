const express = require("express");
const {
  searchUser,
  aboutUser,
  updateUserData,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/search/:emailAddress", authMiddleware, searchUser);
router.get("/about", authMiddleware, aboutUser);
router.patch("/about", authMiddleware, updateUserData);

module.exports = router;
