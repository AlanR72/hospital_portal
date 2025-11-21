const express = require("express");
const router = express.Router();
const { getNextAppointment } = require("../Controllers/appointmentsController");

router.get("/:patientId/next", getNextAppointment);

module.exports = router;
