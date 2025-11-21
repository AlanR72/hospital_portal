const pool = require("../database/connection");

const getPatientById = (req, res) => {
  const patientId = req.params.id;
  const sql = "SELECT * FROM patients WHERE id = ?";
  pool.query(sql, [patientId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!results.length) return res.status(404).json({ error: "Patient not found" });

    const patient = results[0];

    // calculate age
    const dob = new Date(patient.dob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

    res.json({ ...patient, age });
  });
};

module.exports = { getPatientById };
