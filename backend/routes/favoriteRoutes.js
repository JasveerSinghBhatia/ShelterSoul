// backend/routes/favoriteRoutes.js
const express = require("express");
const { addFavorite, removeFavorite, getFavorites } = require("../Controllers/favoriteController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Add pet to favorites
router.post("/:petId", protect, addFavorite);

// Remove pet from favorites
router.delete("/:petId", protect, removeFavorite);

// Get all favorites for adopter
router.get("/", protect, getFavorites);

module.exports = router;
