/**
 * @file This file defines a controller for the Parent's Dashboard.
 */

// -----------------------------------------------------------------------------
// SETUP
// -----------------------------------------------------------------------------

// Import the database connection pool.
const pool = require("../database/connection");

// -----------------------------------------------------------------------------
// FUNCTION: getParentDashboard
// PURPOSE: To fetch all the dashboard data for a parent's child. This function
//          first finds the child linked to the parent, then fetches that
//          child's appointments, medicines, and medical team.
// API ENDPOINT: GET /parentDashboard/byParent/:parentUserId
// -----------------------------------------------------------------------------
const getParentDashboard = (req, res) => {

  // --- 1. Get the Parent's ID ---
  // Extract the 'parentUserId' from the URL.
  // For example, in a request to '/api/parentDashboard/byParent/456', parentUserId will be '456'.
  const parentUserId = req.params.parentUserId;


  // --- 2. Step 1: Find the Child Patient Linked to this Parent ---
  // This query looks in the `parent_child` link table to find the patient ID associated with the parent's user ID.
  // It then JOINS with the `patients` table to get the full details of that child.
  const patientQuery = `
    SELECT p.*
    FROM parent_child pc
    JOIN patients p ON pc.patient_id = p.id
    WHERE pc.parent_user_id = ?
  `;

  // Execute the first query to find the child.
  pool.query(patientQuery, [parentUserId], (err, patientResults) => {

    // --- Initial Validation ---
    // Handle any database errors from this first query.
    if (err) return res.status(500).json({ error: "Database error fetching patient" });

    // If no child is linked to this parent, stop and send a "Not Found" error.
    if (patientResults.length === 0) return res.status(404).json({ error: "No child found for this parent" });

    // If a child was found, store their information. We'll need their ID for the next queries.
    const patient = patientResults[0];

    // --- Define the next set of queries for the child's data ---
    // Step 2: Query to get the child's appointments.
    const appointmentsQuery = `
      SELECT id, appointment_date, location, purpose, status, notes AS appointment_notes
      FROM appointments
      WHERE patient_id = ?
      ORDER BY appointment_date DESC
    `;

    // Step 3: Query to get the child's medicines.
    const medicinesQuery = `
      SELECT id, medicine_name, dosage, frequency, start_date, end_date, prescribed_by, notes AS medicine_notes
      FROM medicines
      WHERE patient_id = ?
    `;

    // Step 4: Query to get the child's medical team.
    const medicalTeamQuery = `
      SELECT mt.id, mt.name, mt.role, mt.department, mt.contact_email, mt.contact_phone, mt.profile_notes, pt.relationship, pt.notes AS patient_notes
      FROM patient_team pt
      JOIN medical_team mt ON pt.team_member_id = mt.id
      WHERE pt.patient_id = ?
    `;

    // --- 3. Execute the Remaining Queries in a Nested Sequence ---
    // This is called "nested callbacks" or the "callback pyramid".
    // The second query is placed inside the success callback of the first, and so on.

    // Execute the appointments query using the child's ID (`patient.id`).
    pool.query(appointmentsQuery, [patient.id], (err, appointments) => {

      // Handle errors for this specific query.
      if (err) return res.status(500).json({ error: "Database error fetching appointments" });

      // If successful, now execute the medicines query from inside this callback.
      pool.query(medicinesQuery, [patient.id], (err, medicines) => {

        // Handle errors for this specific query.
        if (err) return res.status(500).json({ error: "Database error fetching medicines" });

        // If successful, now execute the medical team query from inside *this* callback.
        pool.query(medicalTeamQuery, [patient.id], (err, medicalTeam) => {

          // Handle errors for this final query.
          if (err) return res.status(500).json({ error: "Database error fetching medical team" });

          // --- 4. Success: All Data is Gathered ---
          // If all three nested queries succeed, we now have all our data:
          // `patient` (from the first query)
          // `appointments`, `medicines`, `medicalTeam` (from the nested queries)

          // Send the complete dashboard data back to the front-end in a single JSON object.
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

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

// Make the function available to the router.
module.exports = { getParentDashboard };
