const express = require("express");
const router = express.Router();
const { getAdminDashboard, searchPatients } = require("../Controllers/adminDashboardController");

router.get("/search", searchPatients);
router.get("/:patientId", getAdminDashboard);


module.exports = router;