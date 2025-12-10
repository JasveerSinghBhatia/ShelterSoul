// backend/Controllers/favoriteController.js
const User = require("../models/User");
const Pet = require("../models/Pet");

// Add pet to favorites
const addFavorite = async (req, res) => {
  try {
    if (req.user.role !== "adopter") {
      return res.status(403).json({ message: "Only adopters can favorite pets" });
    }

    const { petId } = req.params;

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    // Prevent duplicate favorites
    if (req.user.favorites.includes(petId)) {
      return res.status(400).json({ message: "Pet already in favorites" });
    }

    req.user.favorites.push(petId);
    await req.user.save();

    res.json({ message: "Pet added to favorites", favorites: req.user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove pet from favorites
const removeFavorite = async (req, res) => {
  try {
    if (req.user.role !== "adopter") {
      return res.status(403).json({ message: "Only adopters can remove favorites" });
    }

    const { petId } = req.params;

    req.user.favorites = req.user.favorites.filter((id) => id.toString() !== petId);
    await req.user.save();

    res.json({ message: "Pet removed from favorites", favorites: req.user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get adopter’s favorite pets
const getFavorites = async (req, res) => {
  try {
    if (req.user.role !== "adopter") {
      return res.status(403).json({ message: "Only adopters can view favorites" });
    }

    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addFavorite, removeFavorite, getFavorites };
