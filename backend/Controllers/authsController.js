/**
 * @file This file contains the controller for handling user authentication (login).
 */

// -----------------------------------------------------------------------------
// SETUP
// -----------------------------------------------------------------------------

// Import the database connection pool.
const pool = require("../database/connection");

// -----------------------------------------------------------------------------
// FUNCTION: login
// PURPOSE: To authenticate a user based on their username and password, and to
//          return the appropriate data based on their role (patient, parent, admin, etc.).
// -----------------------------------------------------------------------------
const login = (req, res) => {

  // --- 1. Get User Input ---

  // Extract the 'username' and 'password' from the body of the incoming request.
  // This data is sent from the login form in your React application.
  const { username, password } = req.body;

  // --- 2. Define the Initial SQL Query ---

  // This query is designed to find a user by their username and, if they are a patient,
  // immediately fetch their linked patient details in a single database trip.
  const sql = `

    -- SELECT clause: Specifies the columns we want from both the 'users' and 'patients' tables.
    SELECT 
      u.id, u.username, u.password_hash, u.role, u.patient_id,
      p.first_name, p.last_name, p.dob, p.gender, p.address, p.contact_phone, p.notes AS patient_notes
    
    -- FROM clause: Start from the 'users' table, aliased as 'u'.
      FROM users u

    -- LEFT JOIN clause: We link the 'patients' table (aliased as 'p').
    -- A 'LEFT JOIN' is used because not all users are patients (e.g., doctors, parents).
    -- If a user is NOT a patient, the 'p.*' columns will simply be NULL (empty), but the query won't fail.
    LEFT JOIN patients p ON u.patient_id = p.id

    -- WHERE clause: Filter the results to find only the user with the matching username.
    WHERE u.username = ?
  `;

  // --- 3. Execute the Query and Handle Logic ---

  // Send the query to the database, safely inserting the provided username.
  pool.query(sql, [username], (err, results) => {

    // --- Initial Error & User Validation ---

    // First, check for a fundamental database error.
    if (err) return res.status(500).json({ error: "Database error" });

    // Next, check if the 'results' array is empty. If it is, no user with that username was found.
    // We send a 400 "Bad Request" because the user's input was invalid (username doesn't exist).
    if (results.length === 0) return res.status(400).json({ error: "User not found" });

    // If a user was found, it will be the first (and only) item in the 'results' array.
    const user = results[0];

    // --- Password Validation ---
    // IMPORTANT SECURITY NOTE: This is a direct string comparison. In a real-world application,
    // you should NEVER store plain text passwords. You must use a library like 'bcrypt' to
    // hash the password during registration and then use `bcrypt.compare()` here to securely check it.
    // For this educational project, this direct comparison is understandable.
    if (user.password_hash !== password)

      // Send a 401 "Unauthorized" error if the password does not match.
      return res.status(401).json({ error: "Incorrect password" });

    // --- 4. Build the Basic Response ---
    // If the password is correct, we start building the JSON object that we will send back.
    const response = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    // Admin/Dashboard access
    // This is a boolean flag. It checks if the user's role is one of the admin-level types.
    // The front-end can use this 'canAccessAdmin' flag to decide whether to show an "Admin Dashboard" button.
    response.canAccessAdmin = ["doctor", "nurse", "admin"].includes(user.role);


    // --- 5. Role-Specific Logic ---
    // Now we add extra information to the 'response' object based on the user's role.

    // --- A) PATIENT LOGIC ---
    if (user.role === "patient") {
      // Calculate the patient's age based on their date of birth (dob).
      const dob = new Date(user.dob);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--; // Decrement age if the birthday hasn't happened yet this year.

      // Determine the age group based on the calculated age.
      let age_group = "other";
      if (age >= 2 && age <= 4) age_group = "2-4";
      else if (age >= 9 && age <= 12) age_group = "9-12";

      // Add patient-specific data to the response object.
      response.patient_id = user.patient_id;
      response.age_group = age_group;
      response.patient = {
        id: user.patient_id,
        first_name: user.first_name,
        last_name: user.last_name,
        dob: user.dob,
        gender: user.gender,
        address: user.address,
        contact_phone: user.contact_phone,
        notes: user.patient_notes
      };

      // Send the final, detailed response for the patient and stop the function.
      return res.json(response);
    }

    // --- B) PARENT LOGIC ---
    if (user.role === "parent") {

      // If the user is a parent, we need to do a SECOND database query to find their children.
      const childSql = `
        SELECT 
          p.id AS patient_id, p.first_name, p.last_name, p.dob, p.gender, p.address, p.contact_phone, p.notes
        FROM parent_child pc
        JOIN patients p ON pc.patient_id = p.id
        WHERE pc.parent_user_id = ?
      `;

      // Execute this second query. Note the `err2` and `children` variables to avoid conflicts.
      pool.query(childSql, [user.id], (err2, children) => {
        if (err2) return res.status(500).json({ error: "Database error fetching children" });

        // Add the array of children to the response object.
        response.children = children;

        // Send the final response for the parent and stop.
        return res.json(response);
      });

      // We must `return` here to prevent the code below from running before the child query finishes.
      return;
    }

    // --- C) ADMIN/DOCTOR/NURSE LOGIC ---
    // If the user is not a patient or a parent, they must be an admin-type user.
    // They don't need any extra data, so we can send the basic response we built earlier.
    return res.json(response);
  });
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

// Make the 'login' function available for the router file.
module.exports = { login };
