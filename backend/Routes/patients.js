const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  // GET all patients
  router.get("/", (req, res) => {
    pool.query("SELECT * FROM patients", (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    });
  });

   // GET single patient by ID
  router.get("/:id", (req, res) => {
    pool.query("SELECT * FROM patients WHERE id = ?", [req.params.id], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0) return res.status(404).json({ error: "Patient not found" });
      res.json(results[0]);
    });
  });

  return router;
};