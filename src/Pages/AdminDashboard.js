import React, { useState } from "react";

// Search Component
function PatientSearch({ onPatientSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const response = await fetch(`http://localhost:4000/adminDashboard/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch search results");
    }

    setLoading(false);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Search Patients</h2>

      <form onSubmit={handleSearch} style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Enter first name, last name, or ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "8px", width: "70%", marginRight: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{ padding: "8px 12px", borderRadius: "4px", backgroundColor: "#5b9bd5", color: "#fff", border: "none" }}
        >
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>ID</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>First Name</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Last Name</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>DOB</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Age</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Select</th>
            </tr>
          </thead>
          <tbody>
            {results.map((patient) => (
              <tr key={patient.id}>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{patient.id}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{patient.first_name}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{patient.last_name}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{patient.dob}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{patient.age}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  <button
                    style={{ padding: "4px 8px", borderRadius: "4px", backgroundColor: "#28a745", color: "#fff", border: "none" }}
                    onClick={() => onPatientSelect(patient.id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {hasSearched && results.length === 0 && !loading && <p>No results found.</p>}
    </div>
  );
}

// Main Admin Dashboard
export default function AdminDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePatientSelect = async (patientId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/adminDashboard/${patientId}`);
      if (!response.ok) throw new Error("Failed to fetch patient details");
      const data = await response.json();
      setSelectedPatient(data);
    } catch (err) {
      console.error(err);
      alert("Could not load patient details");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <PatientSearch onPatientSelect={handlePatientSelect} />

      {loading && <p>Loading patient details...</p>}

      {selectedPatient && !loading && (
        <div style={{ marginTop: "30px" }}>
          <h2>Patient Details</h2>
          <p><strong>Name:</strong> {selectedPatient.patient.first_name} {selectedPatient.patient.last_name}</p>
          <p><strong>DOB:</strong> {selectedPatient.patient.dob}</p>
          <p><strong>Gender:</strong> {selectedPatient.patient.gender}</p>
          <p><strong>Contact:</strong> {selectedPatient.patient.contact_phone}</p>
          <p><strong>Address:</strong> {selectedPatient.patient.address}</p>
          <p><strong>Notes:</strong> {selectedPatient.patient.patient_notes}</p>

          {/* Appointments */}
          <h3>Appointments</h3>
          {selectedPatient.appointments?.length ? (
            <ul>
              {selectedPatient.appointments.map((appt) => (
                <li key={appt.id}>
                  {appt.appointment_date} - {appt.purpose} at {appt.location} ({appt.status})
                  <br />Notes: {appt.appointment_notes}
                </li>
              ))}
            </ul>
          ) : <p>No appointments found.</p>}

          {/* Medicines */}
          <h3>Medicines</h3>
          {selectedPatient.medicines?.length ? (
            <ul>
              {selectedPatient.medicines.map((med) => (
                <li key={med.id}>
                  {med.medicine_name} - {med.dosage}, {med.frequency}
                  <br />Prescribed by: {med.prescribed_by}
                  <br />Duration: {med.start_date} to {med.end_date}
                  <br />Notes: {med.medicine_notes}
                </li>
              ))}
            </ul>
          ) : <p>No medicines found.</p>}

          {/* Medical Team */}
          <h3>Medical Team</h3>
          {selectedPatient.medicalTeam?.length ? (
            <ul>
              {selectedPatient.medicalTeam.map((mt) => (
                <li key={mt.id}>
                  {mt.role} - {mt.name} ({mt.department})
                  <br />Contact: {mt.contact_email}, {mt.contact_phone}
                  <br />Relationship: {mt.relationship}
                  <br />Notes: {mt.patient_notes}
                </li>
              ))}
            </ul>
          ) : <p>No team members found.</p>}
        </div>
      )}
    </div>
  );
}
