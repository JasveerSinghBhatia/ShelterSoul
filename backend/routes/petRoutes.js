const express = require("express");
const { addPet, getPets, getPetById, updatePet, deletePet } = require("../Controllers/petController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getPets);
router.get("/:id", getPetById);

// Protected (Shelter)
router.post("/", protect, addPet);
router.put("/:id", protect, updatePet);
router.delete("/:id", protect, deletePet);

module.exports = router;
