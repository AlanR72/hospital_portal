const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config(); // Loads variables from .env

const app = express();
app.use(cors()); // Allow browser apps from other ports to use API
app.use(express.json()); // For reading JSON in POST requests

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test route
app.get("/test-db", (req, res) => {
  pool.query("SELECT 1", (err) => {
    if (err) {
      console.error("Database connection failed:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "Database connected successfully!" });
  });
});


// =======================================
// 🚀 LOGIN ROUTE
// =======================================
app.post("/api/login", (req, res) => {
  const { username, password, role } = req.body;

  const sql = `
    SELECT u.id, u.username, u.password_hash, u.role, p.dob
    FROM users u
    LEFT JOIN patients p ON u.patient_id = p.id
    WHERE u.username = ?
  `;

  pool.query(sql, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    console.log("SQL Results for user:", username, results);

    if (results.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = results[0];

    console.log("User object from DB:", user); // 👈 Add this line
  console.log("Password entered:", password); // 👈 And this one

    // No hashing for simplicity (college project)
    if (user.password_hash !== password) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    let response = { username: user.username, role };

    // Determine age group only if role is "patient"
    if (role === "patient" && user.dob) {
      const dob = new Date(user.dob);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

      if (age >= 2 && age <= 4) response.age_group = "2-4";
      else if (age >= 9 && age <= 12) response.age_group = "9-12";
      else response.age_group = "other";
    }

    res.json(response);
  });
});


// =======================================
// Start server
// =======================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});