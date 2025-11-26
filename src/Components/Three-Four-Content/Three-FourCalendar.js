import { useEffect, useState } from "react";
import '../../assets/Styles/Calendar.css'


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
  <div className="child-friendly-container">
    <p className="child-friendly-greeting">
      Hi {appointment?.patient_first_name}! Hope you're feeling happy and well today! 🌟
    </p>

    <p className="child-friendly-appointment">
      Your next fun visit is with <strong>{appointment?.doctor_name || "your doctor"}</strong> on <strong>{appointment?.appointment_date ? new Date(appointment.appointment_date).toLocaleDateString() : "N/A"}</strong>.
    </p>

    <p className="child-friendly-location">
      You'll be going to the <strong>{appointment?.location || "clinic"}</strong>.
    </p>

    <p className="child-friendly-info">
      Just so you remember: your birthday is <strong>{appointment?.patient_dob}</strong> and you are <strong>{appointment?.patient_age}</strong> years old today!
    </p>

    <p className="child-friendly-signoff">
      Can't wait to see you soon {appointment?.patient_first_name}! 🎈
    </p>
  </div>
);

}

export default ThreeFourCalendar;
