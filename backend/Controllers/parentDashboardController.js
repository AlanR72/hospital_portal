const pool = require("../database/connection");

const getParentDashboard = (req, res) => {
  const patientId = req.params.patientId;

  if (!patientId) {
    return res.status(400).json({ error: "Missing patientId parameter" });
  }

  const sql = `
    SELECT 
      first_name, 
      last_name, 
      DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
      TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age
    FROM patients
    WHERE id = ?
  `;

  pool.query(sql, [patientId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ error: "Patient not found" });

    res.json(results[0]);
  });
};

module.exports = { getParentDashboard };