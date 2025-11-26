// ParentDashboard.js
import React, { useState, useEffect } from "react";
import "../assets/Styles/ParentDash.css";


export default function ParentDashboard() {
  // Get parent user ID from localStorage (set at login)
  const parentUserId = localStorage.getItem("userId");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!parentUserId) {
        setError("No parent user ID found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:4000/parentDashboard/byParent/${parentUserId}`);
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [parentUserId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!data || !data.patient) return <div>No data available</div>;

  const { patient, appointments, medicines, medicalTeam } = data;

  return (
    <div className="parent-dashboard">
      <h1>Parent Dashboard</h1>

      {/* Patient Info */}
      <section>
        <h2>{patient.first_name} {patient.last_name}</h2>
        <p>DOB: {patient.dob}</p>
        <p>Gender: {patient.gender}</p>
        <p>Contact: {patient.contact_phone}</p>
        <p>Address: {patient.address}</p>
        <p>Notes: {patient.patient_notes}</p>
      </section>

      {/* Appointments */}
      <section>
        <h3>Appointments</h3>
        {appointments?.length ? appointments.map((a, idx) => (
          <div key={idx}>
            <p>{a.appointment_date} - {a.purpose} at {a.location} ({a.status})</p>
            <p>Notes: {a.appointment_notes}</p>
          </div>
        )) : <p>No appointments found.</p>}
      </section>

      {/* Medicines */}
      <section>
        <h3>Medicines</h3>
        {medicines?.length ? medicines.map((m, idx) => (
          <div key={idx}>
            <p>{m.medicine_name} - {m.dosage}, {m.frequency}</p>
            <p>Prescribed by: {m.prescribed_by}</p>
            <p>Duration: {m.start_date} to {m.end_date}</p>
            <p>Notes: {m.medicine_notes}</p>
          </div>
        )) : <p>No medicines found.</p>}
      </section>

      {/* Medical Team */}
      <section>
        <h3>Medical Team</h3>
        {medicalTeam?.length ? medicalTeam.map((member, idx) => (
          <div key={idx}>
            <p>{member.role} - {member.name} ({member.department})</p>
            <p>Contact: {member.contact_email}, {member.contact_phone}</p>
            <p>Relationship: {member.relationship}</p>
            <p>Notes: {member.patient_notes}</p>
          </div>
        )) : <p>No team members assigned.</p>}
      </section>
    </div>
  );
}
