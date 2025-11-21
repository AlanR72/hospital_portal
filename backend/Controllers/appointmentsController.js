const pool = require("../database/connection");


exports.getNextAppointment = (req, res) => {
  const {patientId} = req.params.id;

 const sql = `
  SELECT a.*, d.name AS doctor_name
  FROM appointments a
  LEFT JOIN doctors d ON a.doctor_id = d.id
  WHERE a.patient_id = ?
  ORDER BY a.appointment_date ASC
  LIMIT 1
`;



  pool.query(sql, [patientId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    res.json(results[0]);
  });
};
