import React, { useState } from "react";
import HospitalMap from '../../assets/images/HospitalMap.png'
import '../../assets/Styles/Activities.css'

import SideImageLeft from "../../assets/images/activity/balls.png"
import SideImageLeft2 from "../../assets/images/activity/blocks.png"
import SideImageLeft3 from "../../assets/images/activity/climb.png"
import SideImageLeft4 from "../../assets/images/activity/swing.png"
import SideImageRight from "../../assets/images/activity/crayons.png"
import SideImageRight2 from "../../assets/images/activity/rocks.png"
import SideImageRight3 from "../../assets/images/activity/climb2.png"
import SideImageRight4 from "../../assets/images/activity/boyonswing.png"

export default function ThreeFourActivities({ setView, patient }) {

  return (
    <div>
      <div className="activities-wrapper">
        {/* Left side images */}
        <div className="side-column left">
          <img src={SideImageLeft} alt="Kids plastic balls" />
          <img src={SideImageLeft2} alt="Building blocks" />
          <img src={SideImageLeft3} alt="Boy climbing" />
          <img src={SideImageLeft4} alt="Swing" />
        </div>


        <div className="child-friendly-container-activities">
          <p className="child-friendly-greeting">
            Hi {patient ? patient.first_name : "there"}! Hope you're feeling happy and well today! 🌟
          </p>
          <p className="child-friendly-greeting">There are lots of cool things to explore in the FunPark area of the hospital! You can try hands-on games, colourful play zones, and plenty of places to laugh and burn off some energy. It’s the perfect spot to take a break and enjoy yourself</p>
          <p className="child-friendly-greeting">Or..if you are feeling energetic the FunPark is also full of exciting rides.</p>
          <p className="child-friendly-greeting">You will find the location of FunPark on the interactive map below.</p>
          <div className="footer-item" onClick={() => setView("Map")}>
              <img src={HospitalMap} alt="Illustration of Hospital" className="hospital-map" />
              <span>Hospital Map</span>
          </div>
        </div>  
        {/* Right side image */}
        <div className="side-column right">
          <img src={SideImageRight} alt="Crayons" />
          <img src={SideImageRight2} alt="Painting rocks" />
          <img src={SideImageRight3} alt="Girl climbing" />
          <img src={SideImageRight4} alt="Boy on swing" />
        </div> 
      </div>
    </div>
  )
}
