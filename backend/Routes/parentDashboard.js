const express = require("express");
const router = express.Router();
const { getParentDashboard } = require("../Controllers/parentDashboardController");

router.get("/:patientId", getParentDashboard);

module.exports = router;