
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


import React, { useState } from "react";


const Portal = () => {
  const ageGroup = localStorage.getItem("age_group");
  const [view, setView] = useState("default");

  const ThreeFourComponents = {
  Medicines: <ThreeFourMedicine />,
  MedicalTeam: <ThreeFourMedicalTeam />,
  Calendar: <ThreeFourCalendar />,
  Content: <ThreeFourContent />,
};

const nineTwelveComponents = {
  Medicines: <NineTwelveMedicine />,
  MedicalTeam: <NineTwelveMedicalTeam />,
  Calendar: <NineTwelveCalendar />,
  Content: <NineTwelveContent />,
};

  // render content based on age group and view
  const renderContent = () => {
    if (ageGroup === "2-4") {
    return ThreeFourComponents[view] || <ThreeFourContent />;
  }

    if (ageGroup === "9-12") {
    return nineTwelveComponents[view] || <NineTwelveContent />;
  }

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
