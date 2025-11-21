// backend/Controllers/authsController.js

const pool = require("../database/connection");

const login = (req, res) => {
  const { username, password, role } = req.body;

  // SQL to get user and associated patient DOB if patient
  const sql = `
    SELECT u.id, u.username, u.password_hash, u.role, u.patient_id, p.dob
    FROM users u
    LEFT JOIN patients p ON u.patient_id = p.id
    WHERE u.username = ?
  `;

  pool.query(sql, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = results[0];

    // Plain-text password check (for now)
    if (user.password_hash !== password) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Prepare response
    let response = {
      username: user.username,
      role: user.role,
    };

    // If patient, calculate age group
    if (user.role === "patient" && user.dob) {
      const dob = new Date(user.dob);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

      response.age = age;
      if (age >= 2 && age <= 4) response.age_group = "2-4";
      else if (age >= 9 && age <= 12) response.age_group = "9-12";
      else response.age_group = "other";
    }

    // Include patient_id for frontend use
    if (user.patient_id) response.patient_id = user.patient_id;

    res.json(response);
  });
};

module.exports = { login };
