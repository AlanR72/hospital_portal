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
  updateAppointment,

  // Medicines
  updateMedicine,

  // Medical Team
  updateTeamMember,
} = require("../Controllers/adminDashboardController");

// ------------------------------------------------------
//                 PATIENT ROUTES
// ------------------------------------------------------
router.get("/search", searchPatients);

router.post("/patient", createPatient);
router.put("/patient/:patientId", updatePatient);
router.delete("/patient/:patientId", deletePatient);

// ------------------------------------------------------
//              APPOINTMENT ROUTES (update only)
// ------------------------------------------------------
router.put("/appointments/:appointmentId", updateAppointment);

// ------------------------------------------------------
//                 MEDICINE ROUTES (update only)
// ------------------------------------------------------
router.put("/medicines/:medicineId", updateMedicine);

// ------------------------------------------------------
//               MEDICAL TEAM ROUTES (update only)
// ------------------------------------------------------
router.put("/team/:teamId", updateTeamMember);

// ------------------------------------------------------
//       SINGLE PATIENT DASHBOARD 
// ------------------------------------------------------
router.get("/:patientId", getAdminDashboard);

module.exports = router;
