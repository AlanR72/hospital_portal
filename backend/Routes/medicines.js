const express = require("express");
const router = express.Router();
const { getPatientMedicines } = require("../Controllers/medicinesController");

router.get("/:patientId", getPatientMedicines);

module.exports = router;
