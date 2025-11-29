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
      const res = await fetch(
        `http://localhost:4000/adminDashboard/search?query=${encodeURIComponent(query)}`
      );
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
            {results.map((patient) => {
              // Format DOB as DD/MM/YYYY
              const dobParts = patient.dob ? patient.dob.split("-") : [];
              const formattedDOB =
                dobParts.length === 3 ? `${dobParts[2]}/${dobParts[1]}/${dobParts[0]}` : patient.dob;

              return (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.first_name}</td>
                  <td>{patient.last_name}</td>
                  <td>{formattedDOB}</td>
                  <td>{patient.age}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => onPatientSelect(patient.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
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
  const [newPatient, setNewPatient] = useState({
    appointments: [{ appointment_date: "", purpose: "TBD", location: "TBD", status: "TBD", appointment_notes: "" }],
    medicines: [{ medicine_name: "TBD", dosage: "TBD", frequency: "TBD", start_date: "", end_date: "", prescribed_by: "TBD", medicine_notes: "" }],
    medicalTeam: [{ name: "TBD", role: "TBD", department: "TBD", contact_email: "", contact_phone: "", relationship: "TBD", patient_notes: "" }]
  });

  const fetchPatient = async (patientId) => {
  try {
    const res = await fetch(`http://localhost:4000/adminDashboard/${patientId}`);
    if (!res.ok) throw new Error("Failed to fetch patient details");
    const data = await res.json();

    setSelectedPatient({
      patient: data.patient || {},
      appointments: data.appointments?.length
        ? data.appointments.map(a => ({
            ...a,
            appointment_date: a.appointment_date?.split("T")[0] || ""
          }))
        : [{ appointment_date: "", purpose: "TBD", location: "TBD", status: "TBD", appointment_notes: "" }],
      medicines: data.medicines?.length
        ? data.medicines.map(m => ({
            ...m,
            start_date: m.start_date?.split("T")[0] || "",
            end_date: m.end_date?.split("T")[0] || ""
          }))
        : [{ medicine_name: "TBD", dosage: "TBD", frequency: "TBD", start_date: "", end_date: "", prescribed_by: "TBD", medicine_notes: "" }],
      medicalTeam: data.medicalTeam?.length
        ? data.medicalTeam
        : [{ name: "TBD", role: "TBD", department: "TBD", contact_email: "", contact_phone: "", relationship: "TBD", patient_notes: "" }]
    });

    // Ensure patient_notes populates correctly
      setPatientForm({
        ...data.patient,
        patient_notes: data.patient?.notes || ""  
      });

    // Convert DOB for the input
    setPatientForm({
      ...data.patient,
      dob: data.patient.dob?.split("T")[0] || ""
    });

  } catch (err) {
    console.error(err);
    alert("Could not load patient details");
  }
};


  const handlePatientSelect = (id) => fetchPatient(id);
  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  // ----------------- Patient CRUD -----------------
  const updatePatient = async () => {
    if (!selectedPatient?.patient?.id) return alert("No patient selected");
    try {
      const res = await fetch(
        `http://localhost:4000/adminDashboard/patient/${selectedPatient.patient.id}`,
        { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patientForm) }
      );
      if (!res.ok) throw new Error("Update failed");
      alert("Patient updated");
      fetchPatient(selectedPatient.patient.id);
    } catch (err) {
      console.error(err);
      alert("Error updating patient");
    }
  };

  const deletePatient = async () => {
    if (!selectedPatient?.patient?.id) return;
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      const res = await fetch(
        `http://localhost:4000/adminDashboard/patient/${selectedPatient.patient.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");
      alert("Patient deleted");
      setSelectedPatient(null);
      setPatientForm({});
    } catch (err) {
      console.error(err);
      alert("Error deleting patient");
    }
  };

  const createPatient = async () => {
    if (!newPatient.first_name || !newPatient.last_name) {
      return alert("Please provide first and last name for the new patient.");
    }
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = await res.json();
      alert("Patient created with ID " + created.patientId);
      setNewPatient({
        appointments: [{ appointment_date: "", purpose: "TBD", location: "TBD", status: "TBD", appointment_notes: "" }],
        medicines: [{ medicine_name: "TBD", dosage: "TBD", frequency: "TBD", start_date: "", end_date: "", prescribed_by: "TBD", medicine_notes: "" }],
        medicalTeam: [{ name: "TBD", role: "TBD", department: "TBD", contact_email: "", contact_phone: "", relationship: "TBD", patient_notes: "" }]
      });
      if (created.patientId) fetchPatient(created.patientId);
    } catch (err) {
      console.error(err);
      alert("Error creating patient: " + (err.message || ""));
    }
  };

  // ----------------- Update Functions Only -----------------
  const updateAppointment = async (id, obj) => {
    const payload = {
      appointment_date: obj.appointment_date,
      location: obj.location,
      purpose: obj.purpose,
      status: obj.status,
      appointment_notes: obj.appointment_notes ?? obj.notes ?? "",
    };
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      alert("Appointment updated");
      fetchPatient(selectedPatient.patient.id);
    } catch (err) {
      console.error(err);
      alert("Error updating appointment");
    }
  };

  const updateMedicine = async (id, obj) => {
    const payload = {
      medicine_name: obj.medicine_name,
      dosage: obj.dosage,
      frequency: obj.frequency,
      start_date: obj.start_date,
      end_date: obj.end_date,
      prescribed_by: obj.prescribed_by,
      medicine_notes: obj.medicine_notes ?? obj.notes ?? "",
    };
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/medicines/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      alert("Medicine updated");
      fetchPatient(selectedPatient.patient.id);
    } catch (err) {
      console.error(err);
      alert("Error updating medicine");
    }
  };

  const updateTeamMember = async (id, obj) => {
    const payload = {
      name: obj.name,
      role: obj.role,
      department: obj.department,
      contact_email: obj.contact_email,
      contact_phone: obj.contact_phone,
      relationship: obj.relationship,
      patient_notes: obj.patient_notes ?? obj.notes ?? "",
    };
    try {
      const res = await fetch(`http://localhost:4000/adminDashboard/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      alert("Team member updated");
      fetchPatient(selectedPatient.patient.id);
    } catch (err) {
      console.error(err);
      alert("Error updating team member");
    }
  };

  // ----------------- JSX -----------------
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <PatientSearch onPatientSelect={handlePatientSelect} />

      {selectedPatient && (
        <div className="patient-section">
          <h2>Edit Patient</h2>
          <div className="form-group">
            {["first_name","last_name","dob","gender","contact_phone","address"].map((key) => (
              <div key={key} className="form-field">
                <label>{key.replace("_"," ").toUpperCase()}</label>
                <input
                  name={key}
                  value={patientForm[key] || ""}
                  type={key==="dob"?"date":"text"}
                  onChange={handleInputChange(setPatientForm)}
                />
              </div>
            ))}
            <div className="form-field full-width">
              <label>Notes</label>
              <textarea
                name="patient_notes"
                value={patientForm.notes || ""}
                onChange={handleInputChange(setPatientForm)}
              />
            </div>
          </div>
          <div className="btn-group main-patient-buttons">
            <button className="btn btn-primary" onClick={updatePatient}>Update Patient</button>
            <button className="btn btn-danger" onClick={deletePatient}>Delete Patient</button>
          </div>

          {/* ---------- Appointments ---------- */}
          <section className="section">
            <h3>Appointments</h3>
            {selectedPatient.appointments.map((a, idx) => {
              const appointmentDateValue = a.appointment_date?.split?.("T")?.[0] || "";
              return (
                <div key={idx} className="sub-form">
                  <div className="form-field">
                    <label>Date</label>
                    <input
                      type="date"
                      value={appointmentDateValue}
                      onChange={(e) =>
                        setSelectedPatient((prev) => ({
                          ...prev,
                          appointments: prev.appointments.map((ap, i) =>
                            i === idx ? { ...ap, appointment_date: e.target.value } : ap
                          ),
                        }))
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label>Purpose</label>
                    <input
                      value={a.purpose || "TBD"}
                      onChange={(e) =>
                        setSelectedPatient((prev) => ({
                          ...prev,
                          appointments: prev.appointments.map((ap, i) =>
                            i === idx ? { ...ap, purpose: e.target.value } : ap
                          ),
                        }))
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label>Location</label>
                    <input
                      value={a.location || "TBD"}
                      onChange={(e) =>
                        setSelectedPatient((prev) => ({
                          ...prev,
                          appointments: prev.appointments.map((ap, i) =>
                            i === idx ? { ...ap, location: e.target.value } : ap
                          ),
                        }))
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label>Status</label>
                    <input
                      value={a.status || "TBD"}
                      onChange={(e) =>
                        setSelectedPatient((prev) => ({
                          ...prev,
                          appointments: prev.appointments.map((ap, i) =>
                            i === idx ? { ...ap, status: e.target.value } : ap
                          ),
                        }))
                      }
                    />
                  </div>
                  <div className="form-field full-width">
                    <label>Notes</label>
                    <textarea
                      value={a.appointment_notes ?? ""}
                      onChange={(e) =>
                        setSelectedPatient((prev) => ({
                          ...prev,
                          appointments: prev.appointments.map((ap, i) =>
                            i === idx
                              ? { ...ap, appointment_notes: e.target.value, notes: e.target.value }
                              : ap
                          ),
                        }))
                      }
                    />
                  </div>
                  <div className="btn-group">
                    <button className="btn btn-primary" onClick={() => updateAppointment(a.id, a)}>
                      Update
                    </button>
                  </div>
                </div>
              );
            })}
          </section>

          {/* ---------- Medicines ---------- */}
          <section className="section">
            <h3>Medicines</h3>
            {selectedPatient.medicines.map((m, idx) => (
              <div key={idx} className="sub-form">
                <div className="form-field">
                  <label>Name</label>
                  <input
                    value={m.medicine_name || "TBD"}
                    onChange={(e) =>
                      setSelectedPatient((prev) => ({
                        ...prev,
                        medicines: prev.medicines.map((med, i) =>
                          i === idx ? { ...med, medicine_name: e.target.value } : med
                        ),
                      }))
                    }
                  />
                </div>
                <div className="form-field">
                  <label>Dosage</label>
                  <input
                    value={m.dosage || "TBD"}
                    onChange={(e) =>
                      setSelectedPatient((prev) => ({
                        ...prev,
                        medicines: prev.medicines.map((med, i) =>
                          i === idx ? { ...med, dosage: e.target.value } : med
                        ),
                      }))
                    }
                  />
                </div>
                <div className="form-field">
                  <label>Frequency</label>
                  <input
                    value={m.frequency || "TBD"}
                    onChange={(e) =>
                      setSelectedPatient((prev) => ({
                        ...prev,
                        medicines: prev.medicines.map((med, i) =>
                          i === idx ? { ...med, frequency: e.target.value } : med
                        ),
                      }))
                    }
                  />
                </div>
                <div className="form-field">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={m.start_date?.split?.("T")?.[0] || ""}
                    onChange={(e) =>
                      setSelectedPatient((prev) => ({
                        ...prev,
                        medicines: prev.medicines.map((med, i) =>
                          i === idx ? { ...med, start_date: e.target.value } : med
                        ),
                      }))
                    }
                  />
                </div>
                <div className="form-field">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={m.end_date?.split?.("T")?.[0] || ""}
                    onChange={(e) =>
                      setSelectedPatient((prev) => ({
                        ...prev,
                        medicines: prev.medicines.map((med, i) =>
                          i === idx ? { ...med, end_date: e.target.value } : med
                        ),
                      }))
                    }
                  />
                </div>
                <div className="form-field">
                  <label>Prescribed By</label>
                  <input
                    value={m.prescribed_by || "TBD"}
                    onChange={(e) =>
                      setSelectedPatient((prev) => ({
                        ...prev,
                        medicines: prev.medicines.map((med, i) =>
                          i === idx ? { ...med, prescribed_by: e.target.value } : med
                        ),
                      }))
                    }
                  />
                </div>
                <div className="form-field full-width">
                  <label>Notes</label>
                  <textarea
                    value={m.medicine_notes ?? ""}
                    onChange={(e) =>
                      setSelectedPatient((prev) => ({
                        ...prev,
                        medicines: prev.medicines.map((med, i) =>
                          i === idx
                            ? { ...med, medicine_notes: e.target.value, notes: e.target.value }
                            : med
                        ),
                      }))
                    }
                  />
                </div>
                <div className="btn-group">
                  <button className="btn btn-primary" onClick={() => updateMedicine(m.id, m)}>
                    Update
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* ---------- Medical Team ---------- */}
          <section className="section">
            <h3>Medical Team</h3>
            {selectedPatient.medicalTeam.map((mt, idx) => (
              <div key={idx} className="sub-form">
                <div className="form-field">
                  <label>Name</label>
                  <input
                    value={mt.name || "TBD"}
                    onChange={(e) =>
                      setSelectedPatient((prev) => ({
                        ...prev,
                        medicalTeam: prev.medicalTeam.map((t, i) =>
                          i === idx ? { ...t, name: e.target.value } : t
                        ),
                      }))
                    }
                  />
                </div>
                <div className="form-field">
                  <label>Role</label>
                  <input
                    value={mt.role || "TBD"}
                    onChange={(e) =>
                      setSelectedPatient((prev) => ({
                        ...prev,
                        medicalTeam: prev.medicalTeam.map((t, i) =>
                          i === idx ? { ...t, role: e.target.value } : t
                        ),
                      }))
                    }
                  />
                </div>
                <div className="form-field">
                  <label>Department</label>
                  <input
                    value={mt.department || "TBD"}
                    onChange={(e) =>
                      setSelectedPatient((prev) => ({
                        ...prev,
                        medicalTeam: prev.medicalTeam.map((t, i) =>
                          i === idx ? { ...t, department: e.target.value } : t
                        ),
                      }))
                    }
                  />
                </div>
                <div className="form-field">
                  <label>Email</label>
                  <input
                    value={mt.contact_email || ""}
                    onChange={(e) =>
                      setSelectedPatient((prev) => ({
                        ...prev,
                        medicalTeam: prev.medicalTeam.map((t, i) =>
                          i === idx ? { ...t, contact_email: e.target.value } : t
                        ),
                      }))
                    }
                  />
                </div>
                <div className="form-field">
                  <label>Phone</label>
                  <input
                    value={mt.contact_phone || ""}
                    onChange={(e) =>
                      setSelectedPatient((prev) => ({
                        ...prev,
                        medicalTeam: prev.medicalTeam.map((t, i) =>
                          i === idx ? { ...t, contact_phone: e.target.value } : t
                        ),
                      }))
                    }
                  />
                </div>
                <div className="form-field">
                  <label>Relationship</label>
                  <input
                    value={mt.relationship || "TBD"}
                    onChange={(e) =>
                      setSelectedPatient((prev) => ({
                        ...prev,
                        medicalTeam: prev.medicalTeam.map((t, i) =>
                          i === idx ? { ...t, relationship: e.target.value } : t
                        ),
                      }))
                    }
                  />
                </div>
                <div className="form-field full-width">
                  <label>Notes</label>
                  <textarea
                    value={mt.profile_notes ?? mt.patient_notes ?? mt.notes ?? ""}
                    onChange={(e) =>
                      setSelectedPatient((prev) => ({
                        ...prev,
                        medicalTeam: prev.medicalTeam.map((t, i) =>
                          i === idx
                            ? { ...t, profile_notes: e.target.value, patient_notes: e.target.value, notes: e.target.value }
                            : t
                        ),
                      }))
                    }
                  />
                </div>
                <div className="btn-group">
                  <button className="btn btn-primary" onClick={() => updateTeamMember(mt.id, mt)}>
                    Update
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}

      {/* ---------- Add New Patient ---------- */}
      <div className="patient-section">
        <h2>Add New Patient</h2>
        <div className="form-group">
          {["first_name","last_name","dob","gender","contact_phone","address"].map((key) => (
            <div key={key} className="form-field">
              <label>{key.replace("_"," ").toUpperCase()}</label>
              <input
                name={key}
                value={newPatient[key] || ""}
                type={key==="dob"?"date":"text"}
                onChange={handleInputChange(setNewPatient)}
              />
            </div>
          ))}
          <div className="form-field full-width">
            <label>Notes</label>
            <textarea
              name="patient_notes"
              value={newPatient.patient_notes || ""}
              onChange={handleInputChange(setNewPatient)}
            />
          </div>
        </div>
        <button className="btn btn-success" onClick={createPatient}>Add Patient</button>
      </div>
    </div>
  );
}
