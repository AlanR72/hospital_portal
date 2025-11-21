const express = require("express");
const router = express.Router();
const { getMedicalTeamByPatient } = require("../Controllers/medicalTeamController");

router.get("/:id", getMedicalTeamByPatient);

module.exports = router;
