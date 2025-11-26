import React, { useState } from "react";
import "../assets/Styles/Admin.css";

// ----------------- Patient Search -----------------
function PatientSearch({ onPatientSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch search results");
    }
    setLoading(false);
  };

  return (
    <div className="patient-search">
      <h2>Search Patients</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter first name, last name, or ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {results.length > 0 ? (
        <table className="results-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>DOB</th>
              <th>Age</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.first_name}</td>
                <td>{patient.last_name}</td>
                <td>{patient.dob}</td>
                <td>{patient.age}</td>
                <td>
                  <button className="btn btn-success" onClick={() => onPatientSelect(patient.id)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No results found.</p>
      )}
    </div>
  );
}

// ----------------- Admin Dashboard -----------------
export default function AdminDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientForm, setPatientForm] = useState({});
  const [newPatient, setNewPatient] = useState({});
  const [appointmentForm, setAppointmentForm] = useState({});
  const [medicineForm, setMedicineForm] = useState({});
  const [teamForm, setTeamForm] = useState({});

  // ----------------- Fetch Patient -----------------
  const fetchPatient = async (patientId) => {
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/${patientId}`);
      if (!res.ok) throw new Error("Failed to fetch patient details");
      const data = await res.json();
      setSelectedPatient(data);
      setPatientForm(data.patient);
    } catch (err) {
      console.error(err);
      alert("Could not load patient details");
    }
  };

  const handlePatientSelect = (id) => fetchPatient(id);

  // ----------------- Form Changes -----------------
  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  // ----------------- Patient CRUD -----------------
  const updatePatient = async () => {
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/patient/${selectedPatient.patient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientForm),
      });
      if (!res.ok) throw new Error("Update failed");
      alert("Patient updated");
      fetchPatient(selectedPatient.patient.id);
    } catch (err) {
      console.error(err);
      alert("Error updating patient");
    }
  };

  const deletePatient = async () => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/patient/${selectedPatient.patient.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      alert("Patient deleted");
      setSelectedPatient(null);
    } catch (err) {
      console.error(err);
      alert("Error deleting patient");
    }
  };

  const createPatient = async () => {
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = await res.json();
      alert("Patient created with ID " + created.id);
      setNewPatient({});
    } catch (err) {
      console.error(err);
      alert("Error creating patient");
    }
  };

  // ----------------- Appointment CRUD -----------------
  const createAppointment = async () => {
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/${selectedPatient.patient.id}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentForm),
      });
      if (!res.ok) throw new Error("Failed to create appointment");
      alert("Appointment created");
      fetchPatient(selectedPatient.patient.id);
      setAppointmentForm({});
    } catch (err) {
      console.error(err);
    }
  };

  const updateAppointment = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentForm),
      });
      if (!res.ok) throw new Error("Update failed");
      alert("Appointment updated");
      fetchPatient(selectedPatient.patient.id);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/appointments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      alert("Appointment deleted");
      fetchPatient(selectedPatient.patient.id);
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------- Medicine CRUD -----------------
  const createMedicine = async () => {
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/${selectedPatient.patient.id}/medicines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medicineForm),
      });
      if (!res.ok) throw new Error("Failed to create medicine");
      alert("Medicine created");
      fetchPatient(selectedPatient.patient.id);
      setMedicineForm({});
    } catch (err) {
      console.error(err);
    }
  };

  const updateMedicine = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/medicines/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medicineForm),
      });
      if (!res.ok) throw new Error("Update failed");
      alert("Medicine updated");
      fetchPatient(selectedPatient.patient.id);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMedicine = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/medicines/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      alert("Medicine deleted");
      fetchPatient(selectedPatient.patient.id);
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------- Medical Team CRUD -----------------
  const createTeamMember = async () => {
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/${selectedPatient.patient.id}/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamForm),
      });
      if (!res.ok) throw new Error("Failed to create team member");
      alert("Team member added");
      fetchPatient(selectedPatient.patient.id);
      setTeamForm({});
    } catch (err) {
      console.error(err);
    }
  };

  const updateTeamMember = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamForm),
      });
      if (!res.ok) throw new Error("Update failed");
      alert("Team member updated");
      fetchPatient(selectedPatient.patient.id);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTeamMember = async (id) => {
    if (!window.confirm("Delete this team member?")) return;
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/team/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      alert("Team member deleted");
      fetchPatient(selectedPatient.patient.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <PatientSearch onPatientSelect={handlePatientSelect} />

      {selectedPatient && (
        <div className="patient-section">
          <h2>Edit Patient</h2>
          <div className="form-group">
            <input name="first_name" value={patientForm.first_name || ""} onChange={handleInputChange(setPatientForm)} placeholder="First Name" />
            <input name="last_name" value={patientForm.last_name || ""} onChange={handleInputChange(setPatientForm)} placeholder="Last Name" />
            <input name="dob" type="date" value={patientForm.dob || ""} onChange={handleInputChange(setPatientForm)} />
            <input name="gender" value={patientForm.gender || ""} onChange={handleInputChange(setPatientForm)} placeholder="Gender" />
            <input name="contact_phone" value={patientForm.contact_phone || ""} onChange={handleInputChange(setPatientForm)} placeholder="Contact" />
            <input name="address" value={patientForm.address || ""} onChange={handleInputChange(setPatientForm)} placeholder="Address" />
            <textarea name="patient_notes" value={patientForm.patient_notes || ""} onChange={handleInputChange(setPatientForm)} placeholder="Notes" />
          </div>
          <div className="btn-group">
            <button className="btn btn-primary" onClick={updatePatient}>Update Patient</button>
            <button className="btn btn-danger" onClick={deletePatient}>Delete Patient</button>
          </div>

          {/* ---------- Appointments ---------- */}
          <section className="section">
            <h3>Appointments</h3>
            {selectedPatient.appointments.map((a) => (
              <div key={a.id} className="sub-form">
                <input placeholder="Date" type="date" value={appointmentForm.appointment_date || a.appointment_date} onChange={handleInputChange(setAppointmentForm)} />
                <input placeholder="Purpose" value={appointmentForm.purpose || a.purpose} onChange={handleInputChange(setAppointmentForm)} />
                <input placeholder="Location" value={appointmentForm.location || a.location} onChange={handleInputChange(setAppointmentForm)} />
                <input placeholder="Status" value={appointmentForm.status || a.status} onChange={handleInputChange(setAppointmentForm)} />
                <textarea placeholder="Notes" value={appointmentForm.appointment_notes || a.appointment_notes} onChange={handleInputChange(setAppointmentForm)} />
                <div className="btn-group">
                  <button className="btn btn-primary" onClick={() => updateAppointment(a.id)}>Update</button>
                  <button className="btn btn-danger" onClick={() => deleteAppointment(a.id)}>Delete</button>
                </div>
              </div>
            ))}
            <h4>Add New Appointment</h4>
            <div className="sub-form">
              <input placeholder="Date" type="date" value={appointmentForm.appointment_date || ""} onChange={handleInputChange(setAppointmentForm)} />
              <input placeholder="Purpose" value={appointmentForm.purpose || ""} onChange={handleInputChange(setAppointmentForm)} />
              <input placeholder="Location" value={appointmentForm.location || ""} onChange={handleInputChange(setAppointmentForm)} />
              <input placeholder="Status" value={appointmentForm.status || ""} onChange={handleInputChange(setAppointmentForm)} />
              <textarea placeholder="Notes" value={appointmentForm.appointment_notes || ""} onChange={handleInputChange(setAppointmentForm)} />
              <button className="btn btn-success" onClick={createAppointment}>Add Appointment</button>
            </div>
          </section>

          {/* ---------- Medicines ---------- */}
          <section className="section">
            <h3>Medicines</h3>
            {selectedPatient.medicines.map((m) => (
              <div key={m.id} className="sub-form">
                <input placeholder="Name" value={medicineForm.medicine_name || m.medicine_name} onChange={handleInputChange(setMedicineForm)} />
                <input placeholder="Dosage" value={medicineForm.dosage || m.dosage} onChange={handleInputChange(setMedicineForm)} />
                <input placeholder="Frequency" value={medicineForm.frequency || m.frequency} onChange={handleInputChange(setMedicineForm)} />
                <input placeholder="Start" type="date" value={medicineForm.start_date || m.start_date} onChange={handleInputChange(setMedicineForm)} />
                <input placeholder="End" type="date" value={medicineForm.end_date || m.end_date} onChange={handleInputChange(setMedicineForm)} />
                <input placeholder="Prescribed By" value={medicineForm.prescribed_by || m.prescribed_by} onChange={handleInputChange(setMedicineForm)} />
                <textarea placeholder="Notes" value={medicineForm.medicine_notes || m.medicine_notes} onChange={handleInputChange(setMedicineForm)} />
                <div className="btn-group">
                  <button className="btn btn-primary" onClick={() => updateMedicine(m.id)}>Update</button>
                  <button className="btn btn-danger" onClick={() => deleteMedicine(m.id)}>Delete</button>
                </div>
              </div>
            ))}
            <h4>Add New Medicine</h4>
            <div className="sub-form">
              <input placeholder="Name" value={medicineForm.medicine_name || ""} onChange={handleInputChange(setMedicineForm)} />
              <input placeholder="Dosage" value={medicineForm.dosage || ""} onChange={handleInputChange(setMedicineForm)} />
              <input placeholder="Frequency" value={medicineForm.frequency || ""} onChange={handleInputChange(setMedicineForm)} />
              <input placeholder="Start" type="date" value={medicineForm.start_date || ""} onChange={handleInputChange(setMedicineForm)} />
              <input placeholder="End" type="date" value={medicineForm.end_date || ""} onChange={handleInputChange(setMedicineForm)} />
              <input placeholder="Prescribed By" value={medicineForm.prescribed_by || ""} onChange={handleInputChange(setMedicineForm)} />
              <textarea placeholder="Notes" value={medicineForm.medicine_notes || ""} onChange={handleInputChange(setMedicineForm)} />
              <button className="btn btn-success" onClick={createMedicine}>Add Medicine</button>
            </div>
          </section>

          {/* ---------- Medical Team ---------- */}
          <section className="section">
            <h3>Medical Team</h3>
            {selectedPatient.medicalTeam.map((mt) => (
              <div key={mt.id} className="sub-form">
                <input placeholder="Name" value={teamForm.name || mt.name} onChange={handleInputChange(setTeamForm)} />
                <input placeholder="Role" value={teamForm.role || mt.role} onChange={handleInputChange(setTeamForm)} />
                <input placeholder="Department" value={teamForm.department || mt.department} onChange={handleInputChange(setTeamForm)} />
                <input placeholder="Email" value={teamForm.contact_email || mt.contact_email} onChange={handleInputChange(setTeamForm)} />
                <input placeholder="Phone" value={teamForm.contact_phone || mt.contact_phone} onChange={handleInputChange(setTeamForm)} />
                <input placeholder="Relationship" value={teamForm.relationship || mt.relationship} onChange={handleInputChange(setTeamForm)} />
                <textarea placeholder="Notes" value={teamForm.patient_notes || mt.patient_notes} onChange={handleInputChange(setTeamForm)} />
                <div className="btn-group">
                  <button className="btn btn-primary" onClick={() => updateTeamMember(mt.id)}>Update</button>
                  <button className="btn btn-danger" onClick={() => deleteTeamMember(mt.id)}>Delete</button>
                </div>
              </div>
            ))}
            <h4>Add New Team Member</h4>
            <div className="sub-form">
              <input placeholder="Name" value={teamForm.name || ""} onChange={handleInputChange(setTeamForm)} />
              <input placeholder="Role" value={teamForm.role || ""} onChange={handleInputChange(setTeamForm)} />
              <input placeholder="Department" value={teamForm.department || ""} onChange={handleInputChange(setTeamForm)} />
              <input placeholder="Email" value={teamForm.contact_email || ""} onChange={handleInputChange(setTeamForm)} />
              <input placeholder="Phone" value={teamForm.contact_phone || ""} onChange={handleInputChange(setTeamForm)} />
              <input placeholder="Relationship" value={teamForm.relationship || ""} onChange={handleInputChange(setTeamForm)} />
              <textarea placeholder="Notes" value={teamForm.patient_notes || ""} onChange={handleInputChange(setTeamForm)} />
              <button className="btn btn-success" onClick={createTeamMember}>Add Team Member</button>
            </div>
          </section>
        </div>
      )}

      {/* ---------- Add New Patient ---------- */}
      <div className="patient-section">
        <h2>Add New Patient</h2>
        <div className="form-group">
          <input placeholder="First Name" value={newPatient.first_name || ""} name="first_name" onChange={handleInputChange(setNewPatient)} />
          <input placeholder="Last Name" value={newPatient.last_name || ""} name="last_name" onChange={handleInputChange(setNewPatient)} />
          <input placeholder="DOB" type="date" value={newPatient.dob || ""} name="dob" onChange={handleInputChange(setNewPatient)} />
          <input placeholder="Gender" value={newPatient.gender || ""} name="gender" onChange={handleInputChange(setNewPatient)} />
          <input placeholder="Contact" value={newPatient.contact_phone || ""} name="contact_phone" onChange={handleInputChange(setNewPatient)} />
          <input placeholder="Address" value={newPatient.address || ""} name="address" onChange={handleInputChange(setNewPatient)} />
          <textarea placeholder="Notes" value={newPatient.patient_notes || ""} name="patient_notes" onChange={handleInputChange(setNewPatient)} />
        </div>
        <button className="btn btn-success" onClick={createPatient}>Add Patient</button>
      </div>
    </div>
  );
}
