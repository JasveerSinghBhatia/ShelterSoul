// backend/Controllers/adminController.js
const User = require("../models/User");

// Get all shelters (pending + approved)
const getAllShelters = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can view shelters" });
    }

    const shelters = await User.find({ role: "shelter" }).select("-password");
    res.json(shelters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve a shelter
const approveShelter = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can approve shelters" });
    }

    const shelter = await User.findById(req.params.id);
    if (!shelter || shelter.role !== "shelter") {
      return res.status(404).json({ message: "Shelter not found" });
    }

    shelter.isApproved = true;
    await shelter.save();

    res.json({ message: "Shelter approved", shelter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user (optional)
const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete users" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllShelters, approveShelter, deleteUser };
