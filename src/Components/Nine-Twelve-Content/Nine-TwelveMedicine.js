import React, { useEffect, useState } from "react";
import '../../assets/Styles/Medicine.css'

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

  const patientName = medicines[0].patient_first_name;

  return (
  <div className="child-medicine-container">
    <h2 className="child-medicine-title">Hello {patientName}!</h2>
    <p>Here’s a guide to the medicines you need to take to stay healthy:</p>

    {medicines.map((med, index) => (
      <div key={index} className="child-medicine-item">
        <p>
          <strong>{med.medicine_name}</strong> is your medicine. You should take it <strong>{med.frequency}</strong>, and the dose is <strong>{med.dosage}</strong>.
        </p>
        <p>
          This medicine was prescribed by <strong>{med.prescribed_by}</strong>. {med.notes ? `Remember: ${med.notes}` : ""}
        </p>
        <p>
          Start date: <strong>{med.start_date}</strong>
          {med.end_date ? ` — End date: <strong>${med.end_date}</strong>` : " — Continue taking it until your doctor tells you to stop."}
        </p>
      </div>
    ))}

    <p>Make sure to take your medicines on time and stay healthy, {patientName}! 💊😊</p>
  </div>


  );
}

export default NineTwelveMedicine;

