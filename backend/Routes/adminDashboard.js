const express = require("express");
const router = express.Router();
const { getAdminDashboard } = require("../Controllers/adminDashboardController");

router.get("/:patientId", getAdminDashboard);

module.exports = router;