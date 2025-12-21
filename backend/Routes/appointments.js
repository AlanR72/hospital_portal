const express = require("express");
const router = express.Router();
const { getNextAppointment } = require("../Controllers/appointmentsController");

// GET next appointment for a patient
router.get("/:patientId/next", getNextAppointment);

module.exports = router;
