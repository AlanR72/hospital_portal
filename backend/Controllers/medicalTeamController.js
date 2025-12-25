/**
 * @file This file defines a controller for handling medical team-related API requests.
 */

// -----------------------------------------------------------------------------
// SETUP
// -----------------------------------------------------------------------------

// Import the database connection pool. This manages our connections to the MySQL database.
const pool = require("../database/connection");

// -----------------------------------------------------------------------------
// FUNCTION: getMedicalTeamForPatient
// PURPOSE: To fetch a list of all medical team members assigned to a specific patient,
//          along with their roles and specific notes for that patient.
// -----------------------------------------------------------------------------

// This function is designed to be an Express route handler.
// 'req' (request) holds incoming information from the client.
// 'res' (response) is used to send a response back to the client.
const getMedicalTeamForPatient = (req, res) => {

  // --- 1. Get and Validate Input ---

  // Extract the 'patientId' from the URL parameters.
  // For example, in a request to '/api/team/patient/123', `patientId` will be '123'.
  const { patientId } = req.params;

  // Input validation: If no patientId was provided, stop and send a 400 "Bad Request" error.
  if (!patientId) {
    return res.status(400).json({ error: "Missing patientId parameter" });
  }

  // --- 2. Define the SQL Query ---

  // This SQL query is the core of the function. It's designed to join three tables together
  // to get all the information we need in one go.
  const sql = `
    -- SELECT clause: Specifies exactly which columns of data we want.
    SELECT 
      mt.id,
      mt.name,
      mt.role,
      mt.department,
      mt.contact_email,
      mt.contact_phone,
      mt.profile_notes,
      mt.photo_url,
      pt.relationship,
      pt.notes AS patient_notes,
      p.first_name AS patient_first_name,
      p.last_name AS patient_last_name

    -- FROM clause: We start with the 'patient_team' table (aliased as 'pt').
    -- This table acts as our central link, connecting patients to team members.
    FROM patient_team pt

    -- JOIN clauses: These "link" the other tables based on matching IDs.
    -- First, we join 'medical_team' (aliased as 'mt') where the ID matches the one in our link table.
    JOIN medical_team mt ON pt.team_member_id = mt.id

    -- Second, we join 'patients' (aliased as 'p') where the ID matches the one in our link table.
    JOIN patients p ON pt.patient_id = p.id

    -- WHERE clause: This filters the results.
    -- We only want the records from the joined tables where the patient ID matches the one we're looking for.
    -- The '?' is a safe placeholder for the "patientId".
    WHERE pt.patient_id = ?
    ORDER BY mt.name
  `;

  // --- 3. Execute the Query and Handle the Response ---

  // 'pool.query' sends the SQL and parameters to the database.
  // The `(err, results) => {}` callback function runs after the database responds.
  pool.query(sql, [patientId], (err, results) => {

    // --- Error Handling ---
    // If the database returns an error, we handle it first.
    if (err) {

      // Log the specific error on the server for the developer to see.
      console.error("Database error:", err);

      // Send a generic 500 "Internal Server Error" response to the client.
      return res.status(500).json({ error: "Database error" });
    }

    // --- Handling "Not Found" ---
    // If the query runs but finds no team members for this patient, 'results' will be an empty array.
    // This isn't an error, so we send a normal success response with a message.
    if (results.length === 0) {
      return res.json({ message: "No medical team assigned" });
    }

    // --- Success Handling ---
    // If team members were found, 'results' is an array of objects.
    // We send the entire array back to the front-end.
    res.json(results);
  });
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

// Make the 'getMedicalTeamForPatient' function available to be used by the router file.
module.exports = { getMedicalTeamForPatient };