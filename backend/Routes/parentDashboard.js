// backend/routes/parentDashboardRoutes.js
const express = require("express");
const router = express.Router();
const { getParentDashboard } = require("../Controllers/parentDashboardController");

router.get("/byParent/:parentUserId", getParentDashboard);

module.exports = router;
