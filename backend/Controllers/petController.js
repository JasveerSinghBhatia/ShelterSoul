// backend/Controllers/petController.js
const Pet = require("../models/Pet");

// Add a new pet (only shelters can add)
const addPet = async (req, res) => {
  try {
    if (req.user.role !== "shelter") {
      return res.status(403).json({ message: "Only shelters can add pets" });
    }

    const { name, age, breed, description } = req.body;

    // Validate input
    if (!name || !age || !breed) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const pet = await Pet.create({
      name,
      age,
      breed,
      description,
      shelter: req.user._id, // shelter who added this pet
    });

    res.status(201).json(pet);
  } catch (error) {
    console.error("Error in addPet:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//  Get all pets (public route)
const getPets = async (req, res) => {
  try {
    const pets = await Pet.find().populate("shelter", "name email");
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get single pet by ID
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate("shelter", "name email");
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update pet (only the shelter who owns it can update)
const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) return res.status(404).json({ message: "Pet not found" });

    // check if current logged in shelter is the owner
    if (pet.shelter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedPet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete pet (only the shelter who owns it can delete)
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) return res.status(404).json({ message: "Pet not found" });

    if (pet.shelter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await pet.deleteOne();
    res.json({ message: "Pet removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search and filter pets (public)
const searchPets = async (req, res) => {
  try {
    const { breed, age, adopted } = req.query;

    let query = {};

    if (breed) query.breed = { $regex: breed, $options: "i" }; // case-insensitive
    if (age) query.age = age;
    if (adopted !== undefined) query.adopted = adopted === "true";

    const pets = await Pet.find(query).populate("shelter", "name email");
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { addPet, getPets, getPetById, updatePet, deletePet ,searchPets };
