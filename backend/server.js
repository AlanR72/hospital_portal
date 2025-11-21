const express = require("express");
const cors = require("cors"); // Add this if not already
const patientsRouter = require("./Routes/patients");
const appointmentsRouter = require("./Routes/appointments");
const medicinesRouter = require("./Routes/medicines");
const medicalTeamRouter = require("./Routes/medicalTeam");
const authRouter = require("./Routes/auth");

const app = express();
app.use(express.json());
app.use(cors()); // allow frontend to fetch

app.use("/patients", patientsRouter);
app.use("/appointments", appointmentsRouter);
app.use("/medicines", medicinesRouter);
app.use("/medicalTeam", medicalTeamRouter);
app.use("/auth", authRouter);

app.listen(4000, () => console.log("Server running on port 4000"));
