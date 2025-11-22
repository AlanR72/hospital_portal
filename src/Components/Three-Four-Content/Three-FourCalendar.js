import { useEffect, useState } from "react";

function ThreeFourCalendar({patientId}) {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const res = await fetch(`http://localhost:4000/appointments/${patientId}/next`, {
          method: "GET",
        });
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
      <p><strong>Date:</strong> {appointment?.appointment_date ? new Date(appointment.appointment_date).toLocaleString() : "N/A"}</p>
      <p><strong>Doctor:</strong> {appointment?.doctor_name || "N/A"}</p>
      <p><strong>Location:</strong> {appointment?.location || "N/A"}</p>
      <p><strong>Name:</strong> {appointment?.patient_first_name} {appointment?.patient_last_name}</p>
      <p><strong>D.O.B:</strong> {appointment?.patient_dob}</p>
      <p><strong>Age:</strong> {appointment?.patient_age}</p>
    </div>
  );
}

export default ThreeFourCalendar;
