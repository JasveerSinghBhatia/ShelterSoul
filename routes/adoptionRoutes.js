// backend/routes/adoptionRoutes.js
const express = require("express");
const {
  requestAdoption,
  getAdoptionRequests,
  updateAdoptionStatus,
  getMyAdoptions,
} = require("../Controllers/adoptionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Adopter requests adoption
router.post("/:petId", protect, requestAdoption);

// Shelter views adoption requests for their pets
router.get("/", protect, getAdoptionRequests);

// Shelter updates adoption status
router.put("/:id", protect, updateAdoptionStatus);

// Adopter views their own requests
router.get("/my", protect, getMyAdoptions);

module.exports = router;
