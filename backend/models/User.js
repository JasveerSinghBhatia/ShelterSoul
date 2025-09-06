const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["adopter", "shelter", "volunteer", "admin"],
      default: "adopter",
    },
    location: { type: String },
    phone: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
