const pool = require("../database/connection");

const getPatientMedicines = (req, res) => {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({ error: "Missing patientId parameter" });
  }

  const sql = `
    SELECT 
      medicine_name, 
      dosage, 
      frequency, 
      prescribed_by, 
      notes, 
      DATE_FORMAT(start_date, '%d/%m/%Y') AS start_date,
      DATE_FORMAT(end_date, '%d/%m/%Y') AS end_date
    FROM medicines
    WHERE patient_id = ?
    ORDER BY start_date DESC
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
