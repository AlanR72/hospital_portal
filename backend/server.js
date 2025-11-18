console.log("Server file is running...")

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");

// Test route (still ok to keep here)
const pool = require("./database/connection");
app.get("/test-db", (req, res) => {
  pool.query("SELECT 1", (err) => {
    if (err) {
      console.error("Database connection failed:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    res.json({
      success: true,
      message: "Database connected successfully!",
    });
  });
});

// Use routes
app.use("/api", authRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
