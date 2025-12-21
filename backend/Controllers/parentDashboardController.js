// backend/Controllers/parentDashboardController.js
const pool = require("../database/connection");

// GET /parentDashboard/byParent/:parentUserId
const getParentDashboard = (req, res) => {
  const parentUserId = req.params.parentUserId;

  // Step 1: Find patient linked to this parent
  const patientQuery = `
    SELECT p.*
    FROM parent_child pc
    JOIN patients p ON pc.patient_id = p.id
    WHERE pc.parent_user_id = ?
  `;

  pool.query(patientQuery, [parentUserId], (err, patientResults) => {
    if (err) return res.status(500).json({ error: "Database error fetching patient" });
    if (patientResults.length === 0) return res.status(404).json({ error: "No child found for this parent" });

    const patient = patientResults[0];

    // Step 2: Get appointments
    const appointmentsQuery = `
      SELECT id, appointment_date, location, purpose, status, notes AS appointment_notes
      FROM appointments
      WHERE patient_id = ?
      ORDER BY appointment_date DESC
    `;

    // Step 3: Get medicines
    const medicinesQuery = `
      SELECT id, medicine_name, dosage, frequency, start_date, end_date, prescribed_by, notes AS medicine_notes
      FROM medicines
      WHERE patient_id = ?
    `;

    // Step 4: Get medical team
    const medicalTeamQuery = `
      SELECT mt.id, mt.name, mt.role, mt.department, mt.contact_email, mt.contact_phone, mt.profile_notes, pt.relationship, pt.notes AS patient_notes
      FROM patient_team pt
      JOIN medical_team mt ON pt.team_member_id = mt.id
      WHERE pt.patient_id = ?
    `;

    // Execute all queries in parallel
    pool.query(appointmentsQuery, [patient.id], (err, appointments) => {
      if (err) return res.status(500).json({ error: "Database error fetching appointments" });

      pool.query(medicinesQuery, [patient.id], (err, medicines) => {
        if (err) return res.status(500).json({ error: "Database error fetching medicines" });

        pool.query(medicalTeamQuery, [patient.id], (err, medicalTeam) => {
          if (err) return res.status(500).json({ error: "Database error fetching medical team" });

          // Respond with all data
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

module.exports = { getParentDashboard };
