const pool = require("../database/connection");

// Get full dashboard info for a single patient (same structure as Parent Dashboard)
const getAdminDashboard = (req, res) => {
  const patientId = req.params.patientId;
  if (!patientId) return res.status(400).json({ error: "Missing patientId" });

  // Get patient details
  const patientQuery = `
    SELECT *
    FROM patients
    WHERE id = ?
  `;

  pool.query(patientQuery, [patientId], (err, patientResults) => {
    if (err) return res.status(500).json({ error: "DB error fetching patient" });
    if (!patientResults.length) return res.status(404).json({ error: "Patient not found" });

    const patient = patientResults[0];

    // Appointments (full details)
    const appointmentsQuery = `
      SELECT id, appointment_date, location, purpose, status, notes AS appointment_notes
      FROM appointments
      WHERE patient_id = ?
      ORDER BY appointment_date DESC
    `;

    // Medicines (full details)
    const medicinesQuery = `
      SELECT id, medicine_name, dosage, frequency, start_date, end_date, prescribed_by, notes AS medicine_notes
      FROM medicines
      WHERE patient_id = ?
    `;

    // Medical Team (full details w/ relationship + notes)
    const medicalTeamQuery = `
      SELECT 
        mt.id, mt.name, mt.role, mt.department, mt.contact_email, mt.contact_phone,
        pt.relationship, pt.notes AS patient_notes
      FROM patient_team pt
      JOIN medical_team mt ON pt.team_member_id = mt.id
      WHERE pt.patient_id = ?
    `;

    pool.query(appointmentsQuery, [patientId], (err, appointments) => {
      if (err) return res.status(500).json({ error: "DB error fetching appointments" });

      pool.query(medicinesQuery, [patientId], (err, medicines) => {
        if (err) return res.status(500).json({ error: "DB error fetching medicines" });

        pool.query(medicalTeamQuery, [patientId], (err, medicalTeam) => {
          if (err) return res.status(500).json({ error: "DB error fetching medical team" });

          // Return identical structure to Parent Dashboard
          res.json({
            patient,
            appointments,
            medicines,
            medicalTeam,
          });
        });
      });
    });
  });
};

module.exports = { getAdminDashboard };
