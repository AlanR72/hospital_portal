import { useEffect, useState } from "react";
import '../../assets/Styles/Calendar.css'

function NineTwelveCalendar({patientId}) {
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
      Hello {appointment?.patient_first_name}! We hope you're having a great day! 🙂
    </p>

    <p className="child-friendly-appointment">
      Your next appointment is scheduled with <strong>{appointment?.doctor_name || "your doctor"}</strong> on <strong>{appointment?.appointment_date ? new Date(appointment.appointment_date).toLocaleDateString() : "N/A"}</strong>.
    </p>

    <p className="child-friendly-location">
      The appointment will take place at the <strong>{appointment?.location || "clinic"}</strong>. Make sure to be on time!
    </p>

    <p className="child-friendly-info">
      A quick reminder: your date of birth is <strong>{appointment?.patient_dob}</strong>, which makes you <strong>{appointment?.patient_age}</strong> years old. Keep up the good work growing up healthy!
    </p>

    <p className="child-friendly-signoff">
      See you soon, {appointment?.patient_first_name}! Remember to stay curious and ask questions if you have any. 🎉
    </p>
  </div>

  );
}

export default NineTwelveCalendar;
