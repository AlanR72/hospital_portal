import React, { useState, useEffect } from "react";

import ThreeFourHeader from "../Components/Three-Four-Content/Three-FourHeader";
import ThreeFourContent from "../Components/Three-Four-Content/Three-FourContent";
import ThreeFourFooter from "../Components/Three-Four-Content/Three-FourFooter";
import ThreeFourMedicine from "../Components/Three-Four-Content/Three-FourMedicine";
import ThreeFourMedicalTeam from "../Components/Three-Four-Content/Three-FourMedicalTeam";
import ThreeFourCalendar from "../Components/Three-Four-Content/Three-FourCalendar";

import NineTwelveHeader from "../Components/Nine-Twelve-Content/Nine-TwelveHeader";
import NineTwelveContent from "../Components/Nine-Twelve-Content/Nine-TwelveContent";
import NineTwelveFooter from "../Components/Nine-Twelve-Content/Nine-TwelveFooter";
import NineTwelveMedicine from "../Components/Nine-Twelve-Content/Nine-TwelveMedicine";
import NineTwelveMedicalTeam from "../Components/Nine-Twelve-Content/Nine-TwelveMedicalTeam";
import NineTwelveCalendar from "../Components/Nine-Twelve-Content/Nine-TwelveCalendar";

const Portal = () => {
  const ageGroup = localStorage.getItem("age_group");
  const patientId = Number(localStorage.getItem("patientId"));

  const [view, setView] = useState("Content");
  const [patient, setPatient] = useState(null);

  
  useEffect(() => {
    async function fetchPatient() {
      try {
        const res = await fetch(`http://localhost:4000/patients/${patientId}`);
        const data = await res.json();
        setPatient(data);
      } catch (err) {
        console.error("Error fetching patient:", err);
      }
    }

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  
  if (!patientId) {
    return <p>Error: No patient ID found. Please log in again.</p>;
  }

  const ThreeFourComponents = {
    Medicines: <ThreeFourMedicine patientId={patientId} />,
    MedicalTeam: <ThreeFourMedicalTeam patientId={patientId} />,
    Calendar: <ThreeFourCalendar patientId={patientId} />,
    Content: <ThreeFourContent patient={patient} />,
  };

  const NineTwelveComponents = {
    Medicines: <NineTwelveMedicine patientId={patientId} />,
    MedicalTeam: <NineTwelveMedicalTeam patientId={patientId} />,
    Calendar: <NineTwelveCalendar patientId={patientId} />,
    Content: <NineTwelveContent patientId={patientId} />,
  };

  const renderContent = () => {
    if (ageGroup === "2-4") return ThreeFourComponents[view];
    if (ageGroup === "9-12") return NineTwelveComponents[view];
    return <p>No content available.</p>;
  };


  if (ageGroup === "2-4") {
    return (
      <div>
        <ThreeFourHeader setView={setView} />
        {renderContent()}
        <ThreeFourFooter />
      </div>
    );
  }

  if (ageGroup === "9-12") {
    return (
      <div>
        <NineTwelveHeader setView={setView} />
        {renderContent()}
        <NineTwelveFooter />
      </div>
    );
  }

  return <p>No content available for this age group.</p>;
};

export default Portal;
