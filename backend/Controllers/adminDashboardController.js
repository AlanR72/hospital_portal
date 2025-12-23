/**
 * @file This file is a "controller" for your Node.js application.
 * Its job is to handle incoming web requests from your React front-end,
 * perform actions on the database, and send back a response.
 * Each function in this file corresponds to a specific API endpoint.
 */

// -----------------------------------------------------------------------------
// SETUP
// -----------------------------------------------------------------------------

// We are importing the database connection 'pool'.
// Think of 'pool' as a collection of ready-to-use connections to your MySQL database.
// Using a pool is much more efficient than creating a new connection for every single query.
// The 'require' function is how Node.js imports code from other files.
const pool = require("../database/connection");

// -----------------------------------------------------------------------------
// FUNCTION: getAdminDashboard
// PURPOSE: To fetch all data related to a single patient for their dashboard view.
// -----------------------------------------------------------------------------

// 'async' means this function can use the 'await' keyword, which makes handling
// asynchronous operations (like talking to a database) much cleaner.
// 'req' (request) is an object containing information about the incoming request from the front-end.
// 'res' (response) is an object we use to send a response back to the front-end.
const getAdminDashboard = async (req, res) => {

  // Get the patient's ID from the URL parameters.
  // For example, in a URL like '/api/dashboard/123', `req.params.patientId` would be '123'.
  const patientId = req.params.patientId;

  // --- Input Validation ---
  // It's crucial to check if we received the data we need. If not, we stop and send an error.
  // `res.status(400)` means "Bad Request" - the front-end sent a request we can't fulfill.
  if (!patientId) return res.status(400).json({ error: "Missing patientId" });

  // --- Database Operations ---
  // The 'try...catch' block is for error handling. If anything inside 'try' fails,
  // the code immediately jumps to the 'catch' block.
  try {

    // Query 1: Get the main patient details.
    // `await` pauses the function until the database query is finished.
    // `pool.promise().query()` executes an SQL query.
    // The `?` in the SQL is a placeholder to prevent security issues (SQL Injection).
    // The array `[patientId]` provides the value for the placeholder.
    const [patientResults] = await pool.promise().query(
      `SELECT * FROM patients WHERE id = ?`,
      [patientId]
    );

    // --- Data Validation ---
    // After the query, check if we actually found a patient.
    // `patientResults.length` will be 0 if no patient with that ID was found.
    // `res.status(404)` means "Not Found".
    if (!patientResults.length)
      return res.status(404).json({ error: "Patient not found" });

    // The result is an array, so we get the first (and only) item.
    const patient = patientResults[0];

    // Query 2: Get all appointments for this patient.
    // 'AS appointment_notes' renames the 'notes' column in the result to avoid confusion with other 'notes' columns.
    const [appointments] = await pool.promise().query(
      `SELECT id, appointment_date, location, purpose, status, notes AS appointment_notes
       FROM appointments WHERE patient_id = ? ORDER BY appointment_date DESC`,
      [patientId]
    );

    // Query 3: Get all medicines for this patient.
    const [medicines] = await pool.promise().query(
      `SELECT id, medicine_name, dosage, frequency, start_date, end_date, prescribed_by, notes AS medicine_notes
       FROM medicines WHERE patient_id = ?`,
      [patientId]
    );

    // Query 4: Get the patient's medical team.
    // This is a more advanced query that uses `JOIN` to combine data from two tables:
    // `patient_team` (which links patients to team members) and `medical_team` (which has the team member's details).
    const [medicalTeam] = await pool.promise().query(
      `SELECT mt.id, mt.name, mt.role, mt.department, mt.contact_email, mt.contact_phone, mt.profile_notes,
              pt.relationship, pt.notes AS patient_notes
       FROM patient_team pt
       JOIN medical_team mt ON pt.team_member_id = mt.id
       WHERE pt.patient_id = ?`,
      [patientId]
    );

    // --- Success Response ---
    // If all queries were successful, send a JSON object containing all the fetched data back to the front-end.
    // Logs the detailed error to the server console for the developer to see.
    res.json({ patient, appointments, medicines, medicalTeam });
  } catch (err) {

    // --- Error Handling ---
    // This block runs if any of the 'await' operations failed.
    console.error("getAdminDashboard error:", err);

    // Sends a generic '500 Internal Server Error' response to the front-end.
    // It's a security best practice not to send detailed database errors to the client.
    res.status(500).json({ error: "DB error fetching dashboard", details: err.message });
  }
};

// -----------------------------------------------------------------------------
// FUNCTION: createPatient
// PURPOSE: To create a new patient and their corresponding user login account.
// -----------------------------------------------------------------------------
const createPatient = async (req, res) => {

  // Destructuring: This is a shortcut to pull specific variables from the `req.body` object.
  // `req.body` contains the data sent from the front-end form (e.g., from a React state).
  const { first_name, last_name, dob, gender, contact_phone, address, patient_notes } = req.body;

  // --- Database Transaction ---
  // A transaction is a safety feature for when you need to perform multiple database operations
  // that must all succeed or all fail together.
  const connection = await pool.promise().getConnection();
  try {

    // Step 1: Start the transaction.
    await connection.beginTransaction();

    // Step 2: Insert the new patient into the 'patients' table.
    const [patientResult] = await connection.query(
      `INSERT INTO patients (first_name, last_name, dob, gender, contact_phone, address, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, dob, gender, contact_phone, address, patient_notes]
    );

    // Get the unique ID that the database automatically generated for this new patient.
    const patientId = patientResult.insertId;

    // Step 3: Prepare the details for the new user account.
    // This creates a username like "john_doe". The `|| "user"` is a fallback in case the name is empty.
    const username = `${(first_name || "user").toLowerCase()}_${(last_name || "user").toLowerCase()}`;

    // IMPORTANT: In a real app, this password should be securely generated and hashed with a library like 'bcrypt'.
    const password = "Password123!";
    const role = "patient";

    // Step 4: Insert the new user into the 'users' table, linking it to the new patient's ID.
    await connection.query(
      `INSERT INTO users (username, password_hash, role, patient_id) VALUES (?, ?, ?, ?)`,
      [username, password, role, patientId]
    );

    // Step 5: If all steps above succeeded, commit the transaction to make the changes permanent.
    await connection.commit();

    // Release the connection back to the pool so it can be used by others.
    connection.release();

    // Step 6: Send a success response back to the front-end.
    res.json({ patientId, username, message: `Patient "${first_name} ${last_name}" created successfully.` });

  } catch (err) {

    // --- Transaction Error Handling ---
    // If any step in the 'try' block failed, this 'catch' block runs.
    // Roll back the transaction. This UNDOES all changes made since `beginTransaction()`.
    // It prevents having a patient record without a corresponding user record.
    await connection.rollback().catch(() => { });
    connection.release(); // Always release the connection, even on error.
    console.error("createPatient error:", err);
    res.status(500).json({ error: "DB error creating patient", details: err.message });
  }
};

// -----------------------------------------------------------------------------
// FUNCTION: updatePatient
// PURPOSE: To update the details of an existing patient.
// -----------------------------------------------------------------------------
const updatePatient = (req, res) => {

  // This function uses a different style ("callback") instead of async/await, but achieves the same goal.
  const { patientId } = req.params;
  const { first_name, last_name, dob, gender, contact_phone, address, patient_notes } = req.body;

  // Prepare the SQL UPDATE statement.
  const sql = `UPDATE patients SET first_name=?, last_name=?, dob=?, gender=?, contact_phone=?, address=?, notes=? WHERE id=?`;

  // Execute the query. The last argument is a "callback function" that runs after the query finishes.
  pool.query(sql, [first_name, last_name, dob, gender, contact_phone, address, patient_notes, patientId], (err) => {

    // If the 'err' object exists, it means the query failed. We send a 500 error response.
    if (err) return res.status(500).json({ error: "DB error updating patient", details: err.message });

    // If there was no error, send a success response.
    res.json({ success: true });
  });
};

// -----------------------------------------------------------------------------
// FUNCTION: deletePatient
// PURPOSE: To safely delete a patient and all of their associated data.
// -----------------------------------------------------------------------------
const deletePatient = async (req, res) => {

  // Get the patient's ID from the URL parameters.
  const { patientId } = req.params;

  // --- Database Transaction ---
  // A transaction is used to ensure all deletion operations complete successfully.
  // If any single deletion fails, all previous deletions will be undone (rolled back).
  const connection = await pool.promise().getConnection();
  try {

    // Step 1: Start the transaction.
    await connection.beginTransaction();

    // Step 2: Delete linked "child" records first.
    // It's crucial to delete records that depend on the patient *before* deleting the patient itself.
    // This prevents database errors related to foreign key constraints.
    await connection.query(`DELETE FROM appointments WHERE patient_id=?`, [patientId]);
    await connection.query(`DELETE FROM medicines WHERE patient_id=?`, [patientId]);
    await connection.query(`DELETE FROM patient_team WHERE patient_id=?`, [patientId]);

    // Step 3: Now that all dependent records are gone, safely delete the main "parent" patient record.
    await connection.query(`DELETE FROM patients WHERE id=?`, [patientId]);

    // Step 4: If all deletions were successful, commit the transaction to make the changes permanent.
    await connection.commit();

    // Release the database connection back to the pool.
    connection.release();

    // Send a success response.
    res.json({ success: true });

  } catch (err) {

    // --- Transaction Error Handling ---
    // If any of the delete queries failed, this block runs.
    // Roll back the transaction to undo any deletions that might have occurred.
    await connection.rollback().catch(() => { });
    connection.release(); // Always release the connection.
    console.error("deletePatient error:", err);
    res.status(500).json({ error: "DB error deleting patient", details: err.message });
  }
};

// -----------------------------------------------------------------------------
// FUNCTION: updateAppointment
// PURPOSE: To update the details of an existing appointment.
// -----------------------------------------------------------------------------
const updateAppointment = (req, res) => {
  const { appointmentId } = req.params;
  const { appointment_date, location, purpose, status, appointment_notes } = req.body;

  // Prepare the SQL UPDATE statement with placeholders.
  const sql = `UPDATE appointments SET appointment_date=?, location=?, purpose=?, status=?, notes=? WHERE id=?`;

  // Execute the query using the callback style.
  pool.query(sql, [appointment_date, location, purpose, status, appointment_notes, appointmentId], (err) => {
    if (err) return res.status(500).json({ error: "DB error updating appointment", details: err.message });
    res.json({ success: true });
  });
};

// -----------------------------------------------------------------------------
// FUNCTION: updateMedicine
// PURPOSE: To update the details of an existing medicine record.
// -----------------------------------------------------------------------------
const updateMedicine = (req, res) => {
  const { medicineId } = req.params;
  const { medicine_name, dosage, frequency, start_date, end_date, prescribed_by, medicine_notes } = req.body;
  const sql = `UPDATE medicines SET medicine_name=?, dosage=?, frequency=?, start_date=?, end_date=?, prescribed_by=?, notes=? WHERE id=?`;
  pool.query(sql, [medicine_name, dosage, frequency, start_date, end_date, prescribed_by, medicine_notes, medicineId], (err) => {
    if (err) return res.status(500).json({ error: "DB error updating medicine", details: err.message });
    res.json({ success: true });
  });
};

// -----------------------------------------------------------------------------
// FUNCTION: updateTeamMember (Medical Team)
// PURPOSE: To update the details of a medical team member and their specific role for the patient.
// -----------------------------------------------------------------------------
const updateTeamMember = (req, res) => {
  const { teamId } = req.params;
  const { name, role, department, contact_email, contact_phone, relationship, patient_notes } = req.body;

  // This is a more complex query that updates two tables at once (`medical_team` and `patient_team`)
  // by joining them on the team member's ID.
  const sql = `UPDATE medical_team mt
               JOIN patient_team pt ON pt.team_member_id = mt.id
               SET mt.name=?, mt.role=?, mt.department=?, mt.contact_email=?, mt.contact_phone=?, pt.relationship=?, pt.notes=?
               WHERE mt.id=?`;

  pool.query(sql, [name, role, department, contact_email, contact_phone, relationship, patient_notes, teamId], (err) => {
    if (err) return res.status(500).json({ error: "DB error updating team member", details: err.message });
    res.json({ success: true });
  });
};

// -----------------------------------------------------------------------------
// FUNCTION: searchPatients
// PURPOSE: To find patients based on a name or ID search query.
// -----------------------------------------------------------------------------
const searchPatients = (req, res) => {

  // Get the search term from the URL's query string (e.g., /api/search?query=John).
  const { query } = req.query;

  // If no query is provided, send a "Bad Request" error.
  if (!query) return res.status(400).json({ error: "Missing search query" });

  // Use a regular expression to test if the query string contains only digits.
  const isNumeric = /^\d+$/.test(query);

  // Wrap the query in '%' characters for use with the SQL 'LIKE' operator for partial matching.
  const likeQuery = `%${query}%`;

  let sql, params; // Declare variables to hold the query and its parameters.

  // Conditional logic: use a different SQL query depending on whether the search term is numeric.
  if (isNumeric) {

    // If it's a number, the SQL will search by patient ID OR by name.
    // `TIMESTAMPDIFF` calculates the age based on the date of birth (dob).
    sql = `SELECT id, first_name, last_name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
           TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age
           FROM patients
           WHERE id=? OR first_name LIKE ? OR last_name LIKE ?
           LIMIT 20`; // `LIMIT 20` is a performance best practice to prevent returning too many results.
    params = [query, likeQuery, likeQuery];
  } else {

    // If it's text, the SQL will only search by first name or last name.
    sql = `SELECT id, first_name, last_name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
           TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age
           FROM patients
           WHERE first_name LIKE ? OR last_name LIKE ?
           LIMIT 20`;
    params = [likeQuery, likeQuery];
  }

  // Execute the appropriate SQL query with its parameters.
  pool.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: "DB error searching patients", details: err.message });
    res.json(results);
  });
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

// This is a standard Node.js pattern.
// It makes all the functions defined in this file available to be imported and used in other files.
// Typically, a "router" file will import these functions and assign a URL (API endpoint) to each one.
module.exports = {
  getAdminDashboard,
  searchPatients,
  createPatient,
  updatePatient,
  deletePatient,
  updateAppointment,
  updateMedicine,
  updateTeamMember,
};
