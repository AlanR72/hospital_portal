const express = require("express");
const router = express.Router();
const { login } = require("../Controllers/authsController");

router.post("/login", login);

module.exports = router;
