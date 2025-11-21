// src/Components/Three-Four-Content/Three-FourCalendar.js
import React, { useEffect, useState } from "react";

function NineTwelveCalendar({ patientId }) {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!patientId) {
      setErrorMsg("No patientId provided");
      setLoading(false);
      return;
    }

    const fetchAppointment = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        console.log("Fetching appointment for patientId:", patientId);

        const res = await fetch(`http://localhost:4000/appointments/${patientId}/next`, {
          method: "GET",
          headers: { "Accept": "application/json" },
        });

        // log raw response
        console.log("Raw fetch response:", res);
        // if server returned HTML (res.ok true but content-type text/html) we'll detect that
        const contentType = res.headers.get("content-type") || "";
        console.log("Content-Type:", contentType);

        if (!res.ok) {
          // server replied with 4xx/5xx
          const text = await res.text();
          console.error("Non-OK response body:", text);
          setErrorMsg(`Server returned ${res.status}`);
          setLoading(false);
          return;
        }

        if (!contentType.includes("application/json")) {
          // probably an HTML page (React dev server index.html or 404 page)
          const text = await res.text();
          console.error("Expected JSON but got:", text.slice(0, 500));
          setErrorMsg("Server did not return JSON (check /appointments route). See console.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log("Parsed JSON:", data);

        // data may be null, an object, or have different keys — handle gracefully
        if (!data) {
          setAppointment(null);
          setLoading(false);
          return;
        }

        // Normalize keys if backend uses different names
        // prefer appointment_date, fallback to date or appointmentDate
        const appointmentDate =
          data.appointment_date ?? data.date ?? data.appointmentDate ?? null;
        const doctorName = data.doctor_name ?? data.doctor ?? data.doctorName ?? "";
        const location = data.location ?? "";

        const normalized = {
          ...data,
          appointment_date: appointmentDate,
          doctor_name: doctorName,
          location,
        };

        setAppointment(normalized);
      } catch (err) {
        console.error("Fetch error:", err);
        setErrorMsg("Could not fetch appointment. See console.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [patientId]);

  if (loading) return <p>Loading...</p>;
  if (errorMsg) return <p style={{ color: "crimson" }}>{errorMsg}</p>;

  if (!appointment) return <p>No upcoming appointments found.</p>;

  // Defensive date parsing
  const dateVal = appointment.appointment_date;
  const parsed = dateVal ? new Date(dateVal) : null;
  const dateStr = parsed && !isNaN(parsed.getTime())
    ? parsed.toLocaleString()
    : "Date not available";

  return (
    <div>
      <p>Your next appointment is:</p>
      <p><strong>Date:</strong> {dateStr}</p>
      <p><strong>Doctor:</strong> {appointment.doctor_name || "Doctor not listed"}</p>
      <p><strong>Location:</strong> {appointment.location || "Location not listed"}</p>
    </div>
  );
}

export default NineTwelveCalendar;
