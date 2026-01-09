// backend/routes/adminRoutes.js
const express = require("express");
const {
  getAllShelters,
  approveShelter,
  deleteUser,
} = require("../Controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all shelters
router.get("/shelters", protect, getAllShelters);

// Approve a shelter
router.put("/shelters/:id/approve", protect, approveShelter);

// Delete a user
router.delete("/users/:id", protect, deleteUser);

module.exports = router;
