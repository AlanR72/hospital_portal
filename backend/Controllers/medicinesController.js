/**
 * @file This file defines a controller for handling medicine-related API requests.
 */

// -----------------------------------------------------------------------------
// SETUP
// -----------------------------------------------------------------------------

// Import the database connection pool. This manages our connections to the MySQL database.
const pool = require("../database/connection");

// -----------------------------------------------------------------------------
// FUNCTION: getPatientMedicines
// PURPOSE: To fetch a list of all medicines prescribed to a specific patient.
// -----------------------------------------------------------------------------

// This function is designed to be an Express route handler.
// 'req' (request) holds incoming information from the client.
// 'res' (response) is used to send a response back to the client.
const getPatientMedicines = (req, res) => {

  // --- 1. Get and Validate Input ---

  // Extract the 'patientId' from the URL parameters.
  // For example, in a request to '/api/medicines/patient/123', `patientId` will be '123'.
  const { patientId } = req.params;

  // Input validation: If no patientId was provided, stop and send a 400 "Bad Request" error.
  if (!patientId) {
    return res.status(400).json({ error: "Missing patientId parameter" });
  }

  // --- 2. Define the SQL Query ---

  // This SQL query is designed to get all medicines for a patient and also include
  // some basic patient details for context.
  const sql = `
    -- SELECT clause: Specifies which columns of data we want to retrieve.
    SELECT
      m.id,
      m.patient_id,
      m.medicine_name,
      m.dosage,
      m.frequency,
      m.prescribed_by,
      m.notes,

      -- DATE_FORMAT is an SQL function to format the date into a more readable 'DD/MM/YYYY' string.
      DATE_FORMAT(m.start_date, '%d/%m/%Y') AS start_date,
      DATE_FORMAT(m.end_date, '%d/%m/%Y') AS end_date,

      -- We also select some columns from the 'patients' table for context, renaming them with 'AS'.
      p.first_name AS patient_first_name,
      p.last_name AS patient_last_name,
      DATE_FORMAT(p.dob, '%d/%m/%Y') AS patient_dob,

      -- TIMESTAMPDIFF is an SQL function that calculates the difference between two dates.
      -- Here, it calculates the patient's current age in years.
      TIMESTAMPDIFF(YEAR, p.dob, CURDATE()) AS patient_age

    -- FROM clause: Our starting point is the 'medicines' table (aliased as 'm').
    FROM medicines m

    -- LEFT JOIN clause: We link the 'patients' table (aliased as 'p').
    -- This allows us to get the patient's name and age alongside their medicine details.
    -- A LEFT JOIN is used so that even if a patient ID in the medicines table
    -- was invalid, the query would still return the medicine info (though patient info would be NULL).
    LEFT JOIN patients p ON m.patient_id = p.id

    -- WHERE clause: This filters the results.
    -- We only want medicine records where the patient ID matches the one we are looking for.
    WHERE m.patient_id = ?

    -- ORDER BY clause: This sorts the results.
    -- We are sorting by the start date in DESCending order (newest prescriptions first).
    ORDER BY m.start_date DESC
  `;

  // --- 3. Execute the Query and Handle the Response ---

  // 'pool.query' sends the SQL and parameters to the database.
  // The `(err, results) => {}` callback function runs after the database responds.
  pool.query(sql, [patientId], (err, results) => {

    // --- Error Handling ---
    // If the database returns an error, we handle it first.
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // --- Handling "Not Found" ---
    // If the query runs successfully but finds no medicines for this patient, 'results' will be an empty array.
    if (results.length === 0) {
      return res.json({ message: "No medicines found" });
    }

    // --- Success Handling ---
    // If medicines were found, 'results' is an array of objects.
    // We send the entire array of prescriptions back to the front-end.
    res.json(results);
  });
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

// Make the 'getPatientMedicines' function available to be used by the router file.
module.exports = { getPatientMedicines };