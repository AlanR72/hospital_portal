const pool = require("../database/connection");

// ----------------- Get full dashboard -----------------
const getAdminDashboard = async (req, res) => {
  const patientId = req.params.patientId;
  if (!patientId) return res.status(400).json({ error: "Missing patientId" });

  try {
    const [patientResults] = await pool.promise().query(
      `SELECT * FROM patients WHERE id = ?`,
      [patientId]
    );
    if (!patientResults.length) return res.status(404).json({ error: "Patient not found" });
    const patient = patientResults[0];

    const [appointments] = await pool.promise().query(
      `SELECT id, appointment_date, location, purpose, status, notes AS appointment_notes
       FROM appointments WHERE patient_id = ? ORDER BY appointment_date DESC`,
      [patientId]
    );

    const [medicines] = await pool.promise().query(
      `SELECT id, medicine_name, dosage, frequency, start_date, end_date, prescribed_by, notes AS medicine_notes
       FROM medicines WHERE patient_id = ?`,
      [patientId]
    );

    const [medicalTeam] = await pool.promise().query(
      `SELECT mt.id, mt.name, mt.role, mt.department, mt.contact_email, mt.contact_phone, mt.profile_notes,
              pt.relationship, pt.notes AS patient_notes
       FROM patient_team pt
       JOIN medical_team mt ON pt.team_member_id = mt.id
       WHERE pt.patient_id = ?`,
      [patientId]
    );

    res.json({ patient, appointments, medicines, medicalTeam });
  } catch (err) {
    console.error("getAdminDashboard error:", err);
    res.status(500).json({ error: "DB error fetching dashboard", details: err.message });
  }
};

// ----------------- Patients -----------------
const createPatient = async (req, res) => {
  const { first_name, last_name, dob, gender, contact_phone, address, patient_notes } = req.body;

  const connection = await pool.promise().getConnection();
  try {
    await connection.beginTransaction();

    const [patientResult] = await connection.query(
      `INSERT INTO patients (first_name, last_name, dob, gender, contact_phone, address, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, dob, gender, contact_phone, address, patient_notes]
    );
    const patientId = patientResult.insertId;

    const username = `${(first_name || "user").toLowerCase()}_${(last_name || "user").toLowerCase()}`;
    const password = "Password123!";
    const role = "patient";
    await connection.query(
      `INSERT INTO users (username, password_hash, role, patient_id) VALUES (?, ?, ?, ?)`,
      [username, password, role, patientId]
    );

    await connection.commit();
    connection.release();

    res.json({ patientId, username, message: `Patient "${first_name} ${last_name}" created successfully.` });
  } catch (err) {
    await connection.rollback().catch(() => {});
    connection.release();
    console.error("createPatient error:", err);
    res.status(500).json({ error: "DB error creating patient", details: err.message });
  }
};

const updatePatient = (req, res) => {
  const { patientId } = req.params;
  const { first_name, last_name, dob, gender, contact_phone, address, patient_notes } = req.body;

  const sql = `UPDATE patients SET first_name=?, last_name=?, dob=?, gender=?, contact_phone=?, address=?, notes=? WHERE id=?`;
  pool.query(sql, [first_name, last_name, dob, gender, contact_phone, address, patient_notes, patientId], (err) => {
    if (err) return res.status(500).json({ error: "DB error updating patient", details: err.message });
    res.json({ success: true });
  });
};

// ----------------- Safe Delete Patient -----------------
const deletePatient = async (req, res) => {
  const { patientId } = req.params;

  const connection = await pool.promise().getConnection();
  try {
    await connection.beginTransaction();

    // Delete linked data first
    await connection.query(`DELETE FROM appointments WHERE patient_id=?`, [patientId]);
    await connection.query(`DELETE FROM medicines WHERE patient_id=?`, [patientId]);
    await connection.query(`DELETE FROM patient_team WHERE patient_id=?`, [patientId]);

    // Delete patient
    await connection.query(`DELETE FROM patients WHERE id=?`, [patientId]);

    await connection.commit();
    connection.release();
    res.json({ success: true });
  } catch (err) {
    await connection.rollback().catch(() => {});
    connection.release();
    console.error("deletePatient error:", err);
    res.status(500).json({ error: "DB error deleting patient", details: err.message });
  }
};

// ----------------- Appointments (update only) -----------------
const updateAppointment = (req, res) => {
  const { appointmentId } = req.params;
  const { appointment_date, location, purpose, status, appointment_notes } = req.body;
  const sql = `UPDATE appointments SET appointment_date=?, location=?, purpose=?, status=?, notes=? WHERE id=?`;
  pool.query(sql, [appointment_date, location, purpose, status, appointment_notes, appointmentId], (err) => {
    if (err) return res.status(500).json({ error: "DB error updating appointment", details: err.message });
    res.json({ success: true });
  });
};

// ----------------- Medicines (update only) -----------------
const updateMedicine = (req, res) => {
  const { medicineId } = req.params;
  const { medicine_name, dosage, frequency, start_date, end_date, prescribed_by, medicine_notes } = req.body;
  const sql = `UPDATE medicines SET medicine_name=?, dosage=?, frequency=?, start_date=?, end_date=?, prescribed_by=?, notes=? WHERE id=?`;
  pool.query(sql, [medicine_name, dosage, frequency, start_date, end_date, prescribed_by, medicine_notes, medicineId], (err) => {
    if (err) return res.status(500).json({ error: "DB error updating medicine", details: err.message });
    res.json({ success: true });
  });
};

// ----------------- Medical Team (update only) -----------------
const updateTeamMember = (req, res) => {
  const { teamId } = req.params;
  const { name, role, department, contact_email, contact_phone, relationship, patient_notes } = req.body;
  const sql = `UPDATE medical_team mt
               JOIN patient_team pt ON pt.team_member_id = mt.id
               SET mt.name=?, mt.role=?, mt.department=?, mt.contact_email=?, mt.contact_phone=?, pt.relationship=?, pt.notes=?
               WHERE mt.id=?`;
  pool.query(sql, [name, role, department, contact_email, contact_phone, relationship, patient_notes, teamId], (err) => {
    if (err) return res.status(500).json({ error: "DB error updating team member", details: err.message });
    res.json({ success: true });
  });
};

// ----------------- Search Patients -----------------
const searchPatients = (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Missing search query" });

  const isNumeric = /^\d+$/.test(query);
  const likeQuery = `%${query}%`;

  let sql, params;
  if (isNumeric) {
    sql = `SELECT id, first_name, last_name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
           TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age
           FROM patients
           WHERE id=? OR first_name LIKE ? OR last_name LIKE ?
           LIMIT 20`;
    params = [query, likeQuery, likeQuery];
  } else {
    sql = `SELECT id, first_name, last_name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
           TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age
           FROM patients
           WHERE first_name LIKE ? OR last_name LIKE ?
           LIMIT 20`;
    params = [likeQuery, likeQuery];
  }

  pool.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: "DB error searching patients", details: err.message });
    res.json(results);
  });
};

// ----------------- Exports -----------------
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
