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

    // Check if user already requested adoption for this pet
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
    console.error("Error in requestAdoption:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get adoption requests for pets owned by a shelter
const getAdoptionRequests = async (req, res) => {
  try {
    if (req.user.role !== "shelter") {
      return res.status(403).json({ message: "Only shelters can view requests" });
    }

    const requests = await Adoption.find()
      .populate({
        path: "pet",
        match: { shelter: req.user._id },
        select: "name breed shelter adopted",
      })
      .populate("user", "name email");

    // Filter out requests for pets not owned by this shelter
    const filtered = requests.filter((r) => r.pet !== null);

    res.json(filtered);
  } catch (error) {
    console.error("Error in getAdoptionRequests:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Approve or reject adoption (shelter only)
const updateAdoptionStatus = async (req, res) => {
  try {
    if (req.user.role !== "shelter") {
      return res.status(403).json({ message: "Only shelters can update status" });
    }

    const { status } = req.body; // "approved" or "rejected"
    const adoption = await Adoption.findById(req.params.id).populate("pet");

    if (!adoption) return res.status(404).json({ message: "Adoption not found" });

    // Ensure the pet belongs to this shelter
    if (adoption.pet.shelter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this request" });
    }

    adoption.status = status;
    await adoption.save();

    // If adoption is approved, mark pet as adopted
    if (status === "approved") {
      adoption.pet.adopted = true;
      await adoption.pet.save();
    }

    res.json({ message: `Adoption ${status}`, adoption });
  } catch (error) {
    console.error("Error in updateAdoptionStatus:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all adoptions made by the logged-in adopter
const getMyAdoptions = async (req, res) => {
  try {
    if (req.user.role !== "adopter") {
      return res.status(403).json({ message: "Only adopters can view their requests" });
    }

    const adoptions = await Adoption.find({ user: req.user._id })
      .populate("pet", "name breed adopted");

    res.json(adoptions);
  } catch (error) {
    console.error("Error in getMyAdoptions:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  requestAdoption,
  getAdoptionRequests,
  updateAdoptionStatus,
  getMyAdoptions,
};
