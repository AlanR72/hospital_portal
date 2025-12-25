/**
 * @file This file defines a controller for handling specific patient-related API requests.
 */

// -----------------------------------------------------------------------------
// SETUP
// -----------------------------------------------------------------------------

// Import the database connection pool. This is our tool for communicating with the MySQL database.
const pool = require("../database/connection");

// -----------------------------------------------------------------------------
// FUNCTION: getPatientById
// PURPOSE: To fetch a limited set of public-facing details for a single patient,
//          identified by their unique ID. This might be used for a profile header, for example.
// API ENDPOINT: GET /api/patients/:patientId
// -----------------------------------------------------------------------------

// This function is designed to be an Express route handler.
// 'req' (request) holds information from the client.
// 'res' (response) is used to send data back to the client.
const getPatientById = (req, res) => {


  // --- 1. Get and Validate Input ---

  // Extract the 'patientId' from the URL parameters.
  // For example, in a request to '/api/patients/123', `patientId` will be '123'.
  const patientId = req.params.patientId;

  // Input validation: If no patientId was provided in the URL,
  // we stop immediately and send a 400 "Bad Request" error.
  if (!patientId) {
    return res.status(400).json({ error: "Missing patientId parameter" });
  }

  // --- 2. Define the SQL Query ---

  // This SQL query is designed to get just a few key pieces of information about a patient.
  const sql = `
    -- SELECT clause: Specifies which columns of data we want to get back.
    SELECT 
      first_name, 
      last_name, 

      -- DATE_FORMAT formats the date into 'YYYY-MM-DD' for consistency.
      DATE_FORMAT(dob, '%Y-%m-%d') AS dob,

      -- TIMESTAMPDIFF calculates the age in years based on the date of birth.
      TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age,
      photo_url
    
    -- FROM clause: We are getting data from the 'patients' table.
    FROM patients

    -- WHERE clause: This filters the results to find only the one patient whose 'id' matches.
    -- The '?' is a safe placeholder for the "patientId".
    WHERE id = ?
  `;

  // --- 3. Execute the Query and Handle the Response ---

  // 'pool.query' sends the SQL statement and parameters to the database.
  // The `(err, results) => {}` callback function will run after the database has finished its work.
  pool.query(sql, [patientId], (err, results) => {

    // --- Error Handling ---
    // The first and most important check inside a callback is for an error.

    // Send a generic 500 "Internal Server Error" to the client. We don't want to expose database details.
    if (err) return res.status(500).json({ error: "Database error" });

    // --- Handling "Not Found" ---
    // If the query was successful but found no patient with that ID, 'results' will be an empty array.
    if (results.length === 0)

      // This is a "Not Found" scenario, so we send a 404 error code.
      return res.status(404).json({ error: "Patient not found" });

    // --- Success Handling ---
    // If a patient was found, 'results' is an array with a single object inside it.
    // We send back just that first object `results[0]` for a clean API response.
    res.json(results[0]);
  });
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

// Make the 'getPatientById' function available to be used by the router file,
// which will assign it to a URL like '/api/patients/:patientId'.
module.exports = { getPatientById };