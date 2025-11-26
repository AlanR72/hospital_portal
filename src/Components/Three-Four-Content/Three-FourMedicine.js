import React, { useEffect, useState } from "react";
import '../../assets/Styles/Medicine.css'


function ThreeFourMedicine({ patientId }) {
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
      <h2 className="child-medicine-title">Hi {patientName}!</h2>
      <p>Here are the medicines you need to take:</p>

      {medicines.map((med, index) => (
        <div key={index} className="child-medicine-item">
          <p>
            <strong>{med.medicine_name}</strong> is your medicine. You take it{" "}
            {med.frequency}. The dose is {med.dosage}.
          </p>
          <p>
            Your doctor, {med.prescribed_by}, gave you this medicine.{" "}
            {med.notes ? `Remember: ${med.notes}` : ""}
          </p>
          <p>
            Start date: {med.start_date}
            {med.end_date ? ` — End date: ${med.end_date}` : " — Keep taking it until your doctor says stop."}
          </p>
        </div>
      ))}

      <p>Make sure to take your medicines on time and stay healthy {patientName}! 💊😊</p>
    </div>
  );
}

export default ThreeFourMedicine;
