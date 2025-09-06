const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["dog", "cat", "bird", "other"], required: true },
    age: { type: Number, required: true },
    breed: { type: String },
    description: { type: String },
    image: { type: String }, // URL for pet image
    adopted: { type: Boolean, default: false },
    shelter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", petSchema);
