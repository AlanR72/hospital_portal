const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  // POST /api/login
  router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    pool.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid username" });
      }

      const user = results[0];

      // For your project, all users use the same password
      if (password !== "Password123!") {
        return res.status(401).json({ error: "Incorrect password" });
      }

      // Return role info (used for redirect)
      res.json({
        message: "Login successful",
        username: user.username,
        role: user.role,
        patient_id: user.patient_id,
      });
    });
  });

  return router;
};
