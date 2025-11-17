import React from "react";
import ThreeFourHeader from "../Components/Three-Four-Content/Three-FourHeader";
import ThreeFourContent from "../Components/Three-Four-Content/Three-FourContent";
import ThreeFourFooter from "../Components/Three-Four-Content/Three-FourFooter";

import NineTwelveHeader from "../Components/Nine-Twelve-Content/Nine-TwelveHeader";
import NineTwelveContent from "../Components/Nine-Twelve-Content/Nine-TwelveContent";
import NineTwelveFooter from "../Components/Nine-Twelve-Content/Nine-TwelveFooter";

const Portal = () => {
  const ageGroup = localStorage.getItem("age_group"); // set at login

  if (ageGroup === "2-4") {
    return (
      <div>
        <ThreeFourHeader />
        <ThreeFourContent />
        <ThreeFourFooter />
      </div>
    );
  }

  if (ageGroup === "9-12") {
    return (
      <div>
        <NineTwelveHeader />
        <NineTwelveContent />
        <NineTwelveFooter />
      </div>
    );
  }

  return <p>No content available for this age group.</p>;
};

export default Portal;
