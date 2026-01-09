const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../Controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected
router.get("/me", protect, getUserProfile);

module.exports = router;
