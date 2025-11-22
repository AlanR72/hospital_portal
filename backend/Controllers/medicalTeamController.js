const pool = require("../database/connection");

const getMedicalTeamForPatient = (req, res) => {
const { patientId } = req.params;

if (!patientId) {
return res.status(400).json({ error: "Missing patientId parameter" });
}

const sql = `     SELECT 
      mt.id,
      mt.name,
      mt.role,
      mt.department,
      mt.contact_email,
      mt.contact_phone,
      mt.profile_notes,
      mt.photo_url,
      pt.relationship,
      pt.notes AS patient_notes
    FROM patient_team pt
    JOIN medical_team mt ON pt.team_member_id = mt.id
    WHERE pt.patient_id = ?
    ORDER BY mt.name
  `;

pool.query(sql, [patientId], (err, results) => {
if (err) {
console.error("Database error:", err);
return res.status(500).json({ error: "Database error" });
}


if (results.length === 0) {
  return res.json({ message: "No medical team assigned" });
}

res.json(results);


});
};

module.exports = { getMedicalTeamForPatient };
