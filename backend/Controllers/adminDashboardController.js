const pool = require("../database/connection");

// ----------------- Get full dashboard -----------------
const getAdminDashboard = (req, res) => {
  const patientId = req.params.patientId;
  if (!patientId) return res.status(400).json({ error: "Missing patientId" });

  const patientQuery = `SELECT * FROM patients WHERE id = ?`;
  const appointmentsQuery = `
    SELECT id, appointment_date, location, purpose, status, notes AS appointment_notes
    FROM appointments
    WHERE patient_id = ?
    ORDER BY appointment_date DESC
  `;
  const medicinesQuery = `
    SELECT id, medicine_name, dosage, frequency, start_date, end_date, prescribed_by, notes AS medicine_notes
    FROM medicines
    WHERE patient_id = ?
  `;
  const medicalTeamQuery = `
    SELECT mt.id, mt.name, mt.role, mt.department, mt.contact_email, mt.contact_phone,
           pt.relationship, pt.notes AS patient_notes
    FROM patient_team pt
    JOIN medical_team mt ON pt.team_member_id = mt.id
    WHERE pt.patient_id = ?
  `;

  pool.query(patientQuery, [patientId], (err, patientResults) => {
    if (err) return res.status(500).json({ error: "DB error fetching patient" });
    if (!patientResults.length) return res.status(404).json({ error: "Patient not found" });

    const patient = patientResults[0];

    pool.query(appointmentsQuery, [patientId], (err, appointments) => {
      if (err) return res.status(500).json({ error: "DB error fetching appointments" });

      pool.query(medicinesQuery, [patientId], (err, medicines) => {
        if (err) return res.status(500).json({ error: "DB error fetching medicines" });

        pool.query(medicalTeamQuery, [patientId], (err, medicalTeam) => {
          if (err) return res.status(500).json({ error: "DB error fetching medical team" });

          res.json({ patient, appointments, medicines, medicalTeam });
        });
      });
    });
  });
};

// ----------------- Patients -----------------
const createPatient = (req, res) => {
  const { first_name, last_name, dob, gender, contact_phone, address, patient_notes } = req.body;
  const sql = `INSERT INTO patients (first_name, last_name, dob, gender, contact_phone, address, patient_notes) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  pool.query(sql, [first_name, last_name, dob, gender, contact_phone, address, patient_notes], (err, result) => {
    if (err) return res.status(500).json({ error: "DB error creating patient" });
    res.json({ id: result.insertId });
  });
};

const updatePatient = (req, res) => {
  const { patientId } = req.params;
  const { first_name, last_name, dob, gender, contact_phone, address, patient_notes } = req.body;
  const sql = `UPDATE patients SET first_name=?, last_name=?, dob=?, gender=?, contact_phone=?, address=?, patient_notes=? WHERE id=?`;
  pool.query(sql, [first_name, last_name, dob, gender, contact_phone, address, patient_notes, patientId], (err) => {
    if (err) return res.status(500).json({ error: "DB error updating patient" });
    res.json({ success: true });
  });
};

const deletePatient = (req, res) => {
  const { patientId } = req.params;
  const sql = `DELETE FROM patients WHERE id=?`;
  pool.query(sql, [patientId], (err) => {
    if (err) return res.status(500).json({ error: "DB error deleting patient" });
    res.json({ success: true });
  });
};

// ----------------- Appointments -----------------
const createAppointment = (req, res) => {
  const { patientId } = req.params;
  const { appointment_date, location, purpose, status, appointment_notes } = req.body;
  const sql = `INSERT INTO appointments (patient_id, appointment_date, location, purpose, status, notes) VALUES (?, ?, ?, ?, ?, ?)`;
  pool.query(sql, [patientId, appointment_date, location, purpose, status, appointment_notes], (err) => {
    if (err) return res.status(500).json({ error: "DB error creating appointment" });
    res.json({ success: true });
  });
};

const updateAppointment = (req, res) => {
  const { appointmentId } = req.params;
  const { appointment_date, location, purpose, status, appointment_notes } = req.body;
  const sql = `UPDATE appointments SET appointment_date=?, location=?, purpose=?, status=?, notes=? WHERE id=?`;
  pool.query(sql, [appointment_date, location, purpose, status, appointment_notes, appointmentId], (err) => {
    if (err) return res.status(500).json({ error: "DB error updating appointment" });
    res.json({ success: true });
  });
};

const deleteAppointment = (req, res) => {
  const { appointmentId } = req.params;
  const sql = `DELETE FROM appointments WHERE id=?`;
  pool.query(sql, [appointmentId], (err) => {
    if (err) return res.status(500).json({ error: "DB error deleting appointment" });
    res.json({ success: true });
  });
};

// ----------------- Medicines -----------------
const createMedicine = (req, res) => {
  const { patientId } = req.params;
  const { medicine_name, dosage, frequency, start_date, end_date, prescribed_by, medicine_notes } = req.body;
  const sql = `INSERT INTO medicines (patient_id, medicine_name, dosage, frequency, start_date, end_date, prescribed_by, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  pool.query(sql, [patientId, medicine_name, dosage, frequency, start_date, end_date, prescribed_by, medicine_notes], (err) => {
    if (err) return res.status(500).json({ error: "DB error creating medicine" });
    res.json({ success: true });
  });
};

const updateMedicine = (req, res) => {
  const { medicineId } = req.params;
  const { medicine_name, dosage, frequency, start_date, end_date, prescribed_by, medicine_notes } = req.body;
  const sql = `UPDATE medicines SET medicine_name=?, dosage=?, frequency=?, start_date=?, end_date=?, prescribed_by=?, notes=? WHERE id=?`;
  pool.query(sql, [medicine_name, dosage, frequency, start_date, end_date, prescribed_by, medicine_notes, medicineId], (err) => {
    if (err) return res.status(500).json({ error: "DB error updating medicine" });
    res.json({ success: true });
  });
};

const deleteMedicine = (req, res) => {
  const { medicineId } = req.params;
  const sql = `DELETE FROM medicines WHERE id=?`;
  pool.query(sql, [medicineId], (err) => {
    if (err) return res.status(500).json({ error: "DB error deleting medicine" });
    res.json({ success: true });
  });
};

// ----------------- Medical Team -----------------
const createTeamMember = (req, res) => {
  const { patientId } = req.params;
  const { name, role, department, contact_email, contact_phone, relationship, patient_notes } = req.body;
  const teamMemberSql = `INSERT INTO medical_team (name, role, department, contact_email, contact_phone) VALUES (?, ?, ?, ?, ?)`;
  const linkSql = `INSERT INTO patient_team (patient_id, team_member_id, relationship, notes) VALUES (?, ?, ?, ?)`;

  pool.query(teamMemberSql, [name, role, department, contact_email, contact_phone], (err, result) => {
    if (err) return res.status(500).json({ error: "DB error creating team member" });
    const teamId = result.insertId;

    pool.query(linkSql, [patientId, teamId, relationship, patient_notes], (err) => {
      if (err) return res.status(500).json({ error: "DB error linking team member" });
      res.json({ success: true });
    });
  });
};

const updateTeamMember = (req, res) => {
  const { teamId } = req.params;
  const { name, role, department, contact_email, contact_phone, relationship, patient_notes } = req.body;
  const sql = `UPDATE medical_team mt
               JOIN patient_team pt ON pt.team_member_id = mt.id
               SET mt.name=?, mt.role=?, mt.department=?, mt.contact_email=?, mt.contact_phone=?, pt.relationship=?, pt.notes=?
               WHERE mt.id=?`;
  pool.query(sql, [name, role, department, contact_email, contact_phone, relationship, patient_notes, teamId], (err) => {
    if (err) return res.status(500).json({ error: "DB error updating team member" });
    res.json({ success: true });
  });
};

const deleteTeamMember = (req, res) => {
  const { teamId } = req.params;
  const sql = `DELETE pt, mt FROM patient_team pt JOIN medical_team mt ON pt.team_member_id = mt.id WHERE mt.id=?`;
  pool.query(sql, [teamId], (err) => {
    if (err) return res.status(500).json({ error: "DB error deleting team member" });
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
    sql = `
      SELECT id, first_name, last_name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
             TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age
      FROM patients
      WHERE id = ? OR first_name LIKE ? OR last_name LIKE ?
      LIMIT 20
    `;
    params = [query, likeQuery, likeQuery];
  } else {
    sql = `
      SELECT id, first_name, last_name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
             TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age
      FROM patients
      WHERE first_name LIKE ? OR last_name LIKE ?
      LIMIT 20
    `;
    params = [likeQuery, likeQuery];
  }

  pool.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: "DB error searching patients" });
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
  createAppointment,
  updateAppointment,
  deleteAppointment,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};
