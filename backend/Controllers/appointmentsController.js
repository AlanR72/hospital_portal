/**
 * @file This file defines a controller for handling appointment-related API requests.
 */

// -----------------------------------------------------------------------------
// SETUP
// -----------------------------------------------------------------------------

// Import the database connection pool from another file.
// The 'pool' manages connections to our MySQL database efficiently.
const pool = require("../database/connection");

// -----------------------------------------------------------------------------
// FUNCTION: getNextAppointment
// PURPOSE: To find the single, soonest "upcoming" appointment for a specific patient
//          and return its details, along with information about the patient and doctor.
// -----------------------------------------------------------------------------

// This function is designed to be used as an Express route handler.
// 'req' (request) contains information from the client (e.g., URL parameters).
// 'res' (response) is what we use to send data back to the client.
const getNextAppointment = (req, res) => {

  // --- 1. Get and Validate Input ---

  // Extract the 'patientId' from the URL parameters.
  // For example, in a request to '/api/appointments/next/123', `patientId` will be '123'.
  const { patientId } = req.params;

  // Input validation is crucial. If no patientId was provided in the URL,
  // we stop immediately and send a 400 "Bad Request" error.
  if (!patientId) {
    return res.status(400).json({ error: "Missing patientId parameter" });
  }

  // --- 2. Define the SQL Query ---

  // This is a multi-line string containing a complex SQL query.
  // It's designed to gather all the necessary information in a single database trip.
  const sql = `
  -- SELECT clause: Specifies which columns of data we want to get back.
  SELECT 
    a.id, 
    a.patient_id, 
    a.doctor_id, 
    a.appointment_date, 
    a.location,
    a.purpose, 
    a.status, 
    a.notes,

    -- We use 'AS' to rename columns for clarity in the final JSON result.
    m.name AS doctor_name,
    m.role AS doctor_role,
    m.department AS doctor_specialty,
    p.first_name AS patient_first_name,
    p.last_name AS patient_last_name,
    DATE_FORMAT(p.dob, '%d/%m/%Y') AS patient_dob,
    TIMESTAMPDIFF(YEAR, p.dob, CURDATE()) AS patient_age

    -- FROM clause: Our starting point is the 'appointments' table. We give it a short alias 'a'.
  FROM appointments a

    -- LEFT JOIN clauses: These "link" other tables to our main 'appointments' table.
    -- It's like looking up information in different spreadsheets based on a shared ID.
    -- We join the 'medical_team' table (aliased as 'm') where the doctor's ID matches.
  LEFT JOIN medical_team m ON a.doctor_id = m.id

    -- We join the 'patients' table (aliased as 'p') where the patient's ID matches.
  LEFT JOIN patients p ON a.patient_id = p.id

    -- WHERE clause: These are our filters.
    -- We only want appointments for the specific patient we're looking for. The '?' is a placeholder.
  WHERE a.patient_id = ? 
  
  -- And we only want appointments with a status of 'upcoming'.
  AND a.status = 'upcoming'

  -- ORDER BY clause: This sorts the results.
    -- We sort by appointment_date in ASCending order (earliest to latest).
  ORDER BY a.appointment_date ASC
  LIMIT 1
`;

  // --- 3. Execute the Query and Handle the Response ---

  // 'pool.query' sends the SQL statement to the database.
  // - `sql`: The query string we just defined.
  // - `[patientId]`: An array of values to safely insert into the '?' placeholders.
  // - `(err, results) => {}`: This is a "callback function". It runs *after* the database has finished.
  pool.query(sql, [patientId], (err, results) => {

    // --- Error Handling ---
    // The first thing we do in a callback is check for an error.
    if (err) {

      // Log the detailed error on the server for the developer to see.
      console.error("Database error:", err);

      // Send a generic 500 "Internal Server Error" to the client.
      return res.status(500).json({ error: "Database error" });
    }

    // --- Handling "Not Found" ---
    // If the query ran successfully but found 0 matching appointments, 'results' will be an empty array.
    if (results.length === 0) {

      // This is not an error. We send a normal success response with a clear message.
      return res.json({ message: "No upcoming appointments found" });
    }

    // --- Success Handling ---
    // If we found a result, 'results' will be an array containing one object.
    // We send back just the first object `results[0]` for a cleaner API response.
    res.json(results[0]);
  });
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

// This makes the 'getNextAppointment' function available to be used in other files,
// specifically the router file that assigns it to a URL like '/api/appointments/next/:patientId'.
module.exports = { getNextAppointment };
