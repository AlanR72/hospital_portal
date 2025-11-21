import { useEffect, useState } from "react";

function ThreeFourCalendar({ patientId }) {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const res = await fetch(`http://localhost:4000/appointments/${patientId}/next`);
        const data = await res.json();

        setAppointment(data);   // data can be null, that's OK
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointment:", error);
        setLoading(false);
      }
    }

    fetchAppointment();
  }, [patientId]);

  if (loading) return <p>Loading...</p>;

  if (!appointment) {
    return <p>No upcoming appointments found.</p>;
  }

  return (
    <div>
      <p>Your next appointment is:</p>
      <p><strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleString()}</p>
      <p><strong>Doctor:</strong> {appointment.doctor_name}</p>
      <p><strong>Location:</strong> {appointment.location}</p>
    </div>
  );
}

export default ThreeFourCalendar;
