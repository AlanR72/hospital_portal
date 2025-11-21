const express = require("express");
const router = express.Router();
const { getMedicinesByPatient } = require("../Controllers/medicinesController");

router.get("/:id", getMedicinesByPatient);

module.exports = router;
