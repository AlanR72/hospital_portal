const express = require("express");
const router = express.Router();
const {
  getAdminDashboard,
  searchPatients,
  // Patients
  createPatient,
  updatePatient,
  deletePatient,
  // Appointments
  createAppointment,
  updateAppointment,
  deleteAppointment,
  // Medicines
  createMedicine,
  updateMedicine,
  deleteMedicine,
  // Medical Team
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require("../Controllers/adminDashboardController");

// ----------------- Patient Routes -----------------
router.get("/search", searchPatients);
router.get("/:patientId", getAdminDashboard);
router.post("/patient", createPatient);
router.put("/patient/:patientId", updatePatient);
router.delete("/patient/:patientId", deletePatient);

// ----------------- Appointment Routes -----------------
router.post("/:patientId/appointments", createAppointment);
router.put("/appointments/:appointmentId", updateAppointment);
router.delete("/appointments/:appointmentId", deleteAppointment);

// ----------------- Medicine Routes -----------------
router.post("/:patientId/medicines", createMedicine);
router.put("/medicines/:medicineId", updateMedicine);
router.delete("/medicines/:medicineId", deleteMedicine);

// ----------------- Medical Team Routes -----------------
router.post("/:patientId/team", createTeamMember);
router.put("/team/:teamId", updateTeamMember);
router.delete("/team/:teamId", deleteTeamMember);

module.exports = router;
