// backend/Controllers/adoptionController.js
const Adoption = require("../models/Adoption");
const Pet = require("../models/Pet");

// Create adoption request (adopter only)
const requestAdoption = async (req, res) => {
  try {
    if (req.user.role !== "adopter") {
      return res.status(403).json({ message: "Only adopters can request adoption" });
    }

    const { message } = req.body;
    const { petId } = req.params;

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    const existingRequest = await Adoption.findOne({ pet: petId, user: req.user._id });
    if (existingRequest) {
      return res.status(400).json({ message: "You already requested adoption for this pet" });
    }

    const adoption = await Adoption.create({
      pet: petId,
      user: req.user._id,
      message,
    });

    res.status(201).json(adoption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get adoption requests for shelter’s pets
const getAdoptionRequests = async (req, res) => {
  try {
    if (req.user.role !== "shelter") {
      return res.status(403).json({ message: "Only shelters can view requests" });
    }

    const requests = await Adoption.find()
      .populate({
        path: "pet",
        match: { shelter: req.user._id },
        select: "name breed shelter",
      })
      .populate("user", "name email");

    const filtered = requests.filter((r) => r.pet !== null);

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update adoption status (shelter only)
const updateAdoptionStatus = async (req, res) => {
  try {
    if (req.user.role !== "shelter") {
      return res.status(403).json({ message: "Only shelters can update status" });
    }

    const { status } = req.body;
    const adoption = await Adoption.findById(req.params.id).populate("pet");

    if (!adoption) return res.status(404).json({ message: "Adoption not found" });

    if (adoption.pet.shelter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this request" });
    }

    adoption.status = status;
    await adoption.save();

    res.json(adoption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get adopter’s own adoption requests
const getMyAdoptions = async (req, res) => {
  try {
    if (req.user.role !== "adopter") {
      return res.status(403).json({ message: "Only adopters can view their requests" });
    }

    const adoptions = await Adoption.find({ user: req.user._id })
      .populate("pet", "name breed status");

    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  requestAdoption,
  getAdoptionRequests,
  updateAdoptionStatus,
  getMyAdoptions,
};
