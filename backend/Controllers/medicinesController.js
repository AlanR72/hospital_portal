const pool = require("../database/connection");

const getPatientMedicines = (req, res) => {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({ error: "Missing patientId parameter" });
  }

  const sql = `
    SELECT
      m.id,
      m.patient_id,
      m.medicine_name,
      m.dosage,
      m.frequency,
      m.prescribed_by,
      m.notes,
      DATE_FORMAT(m.start_date, '%d/%m/%Y') AS start_date,
      DATE_FORMAT(m.end_date, '%d/%m/%Y') AS end_date,
      p.first_name AS patient_first_name,
      p.last_name AS patient_last_name,
      DATE_FORMAT(p.dob, '%d/%m/%Y') AS patient_dob,
      TIMESTAMPDIFF(YEAR, p.dob, CURDATE()) AS patient_age
    FROM medicines m
    LEFT JOIN patients p ON m.patient_id = p.id
    WHERE m.patient_id = ?
    ORDER BY m.start_date DESC
  `;

  pool.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.json({ message: "No medicines found" });
    }

    res.json(results);
  });
};

module.exports = { getPatientMedicines };
