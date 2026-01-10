// backend/routes/petRoutes.js
const express = require("express");
const {
  addPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
  searchPets,
} = require("../Controllers/petController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public routes
router.get("/", getPets); // Get all pets
router.get("/search", searchPets); // Search pets
router.get("/:id", getPetById); // Get single pet

// Protected routes (only shelters)
router.post("/", protect, upload.array("images", 10), addPet); // Add pet
router.put("/:id", protect, updatePet); // Update pet
router.delete("/:id", protect, deletePet); // Delete pet

module.exports = router;
