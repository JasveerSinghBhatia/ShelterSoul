// backend/models/Pet.js
const mongoose = require("mongoose");

// Pet schema (linked to Shelter via 'shelter' field)
const petSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    breed: { type: String, required: true },
    description: { type: String },
    shelter: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",  // linked to User model
      required: true 
    },
    adopted: { type: Boolean, default: false }, // adoption status
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", petSchema);
