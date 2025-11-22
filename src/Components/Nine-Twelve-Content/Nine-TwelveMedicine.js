import React, { useEffect, useState } from "react";

function NineTwelveMedicine({ patientId }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!patientId) return;

    async function fetchMedicines() {
      try {
        const res = await fetch(`http://localhost:4000/medicines/${patientId}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        // Ensure it's an array
        setMedicines(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching medicines:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMedicines();
  }, [patientId]);

  if (loading) return <p>Loading medicines...</p>;
  if (error) return <p>Error: {error}</p>;
  if (medicines.length === 0) return <p>No medicines assigned.</p>;

  return (
    <div>
      <h3>Medicines</h3>
      <ul>
        {medicines.map((med, index) => (
          <li key={index}>
            <strong>{med.medicine_name}</strong> — {med.dosage}, {med.frequency} <br />
            Prescribed by: {med.prescribed_by} <br />
            Notes: {med.notes || "None"} <br />
            Start: {med.start_date} — End: {med.end_date || "Ongoing"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NineTwelveMedicine;

