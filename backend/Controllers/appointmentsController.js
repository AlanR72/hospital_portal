const pool = require("../database/connection");

const getNextAppointment = (req, res) => {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({ error: "Missing patientId parameter" });
  }

const sql = `
  SELECT 
    a.id, 
    a.patient_id, 
    a.doctor_id, 
    a.appointment_date, 
    a.location,
    a.purpose, 
    a.status, 
    a.notes,
    m.name AS doctor_name,
    m.role AS doctor_role,
    m.department AS doctor_specialty,
    p.first_name AS patient_first_name,
    p.last_name AS patient_last_name,
    DATE_FORMAT(p.dob, '%d/%m/%Y') AS patient_dob,
    TIMESTAMPDIFF(YEAR, p.dob, CURDATE()) AS patient_age
  FROM appointments a
  LEFT JOIN medical_team m ON a.doctor_id = m.id
  LEFT JOIN patients p ON a.patient_id = p.id
  WHERE a.patient_id = ? AND a.status = 'upcoming'
  ORDER BY a.appointment_date ASC
  LIMIT 1
`;


  pool.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.json({ message: "No upcoming appointments found" });
    }

    res.json(results[0]);
  });
};

module.exports = { getNextAppointment };
