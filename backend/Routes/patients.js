const express = require("express");
const router = express.Router();
const { getPatientById } = require("../Controllers/patientsController");

router.get("/:patientId", getPatientById);

module.exports = router;