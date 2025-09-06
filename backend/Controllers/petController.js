const Pet = require("../models/Pet");

// Add new pet (shelter only)
const addPet = async (req, res) => {
  try {
    const { name, type, age, breed, description, image } = req.body;

    const pet = await Pet.create({
      name,
      type,
      age,
      breed,
      description,
      image,
      shelter: req.user._id, // link to logged-in shelter
    });

    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all pets
const getPets = async (req, res) => {
  try {
    const pets = await Pet.find().populate("shelter", "name email");
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single pet by ID
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate("shelter", "name email");
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update pet
const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) return res.status(404).json({ message: "Pet not found" });

    if (pet.shelter.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete pet
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) return res.status(404).json({ message: "Pet not found" });

    if (pet.shelter.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await pet.deleteOne();
    res.json({ message: "Pet removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addPet, getPets, getPetById, updatePet, deletePet };
