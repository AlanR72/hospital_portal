const express = require("express");
const router = express.Router();
const { getMedicalTeamForPatient } = require("../Controllers/medicalTeamController");

router.get("/:patientId", getMedicalTeamForPatient);

module.exports = router;

