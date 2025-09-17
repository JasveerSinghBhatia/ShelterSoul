const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

//Routes imports
const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");
const adminRoutes = require("./routes/adminRoutes");


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);  // Authentication routes
app.use("/api/pets", petRoutes); // Pet management routes
app.use("/api/adoptions", adoptionRoutes); //Adoption routes
app.use("/api/admin", adminRoutes); // Admin routes

//Health check route
app.get("/", (req, res) => {
  res.send("ShelterSoul API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
