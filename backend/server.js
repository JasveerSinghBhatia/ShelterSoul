const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

//Routes imports
const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);  // Authentication routes
app.use("/api/pets", petRoutes); // Pet management routes
app.use("/api/adoptions", adoptionRoutes); //Adoption routes
app.use("/api/admin", adminRoutes); // Admin routes
app.use("/api/favorites", favoriteRoutes); // register

//Health check route
app.get("/", (req, res) => {
  res.send("ShelterSoul API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
