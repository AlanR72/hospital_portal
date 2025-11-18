const express = require("express");
const router = express.Router();
const pool = require("../database/connection");

// LOGIN ROUTE
router.post("/login", (req, res) => {
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

    if (results.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = results[0];

    // No hashing for simplicity
    if (user.password_hash !== password) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    let response = { username: user.username, role };

    // Age group only for patients
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

module.exports = router;
