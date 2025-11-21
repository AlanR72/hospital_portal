const pool = require("../database/connection");

const getMedicalTeamByPatient = (req, res) => {
  const patientId = req.params.id;
  const sql = `
    SELECT mt.*
    FROM patient_team pt
    JOIN medical_team mt ON pt.team_member_id = mt.id
    WHERE pt.patient_id = ?
  `;
  pool.query(sql, [patientId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
};

module.exports = { getMedicalTeamByPatient };
