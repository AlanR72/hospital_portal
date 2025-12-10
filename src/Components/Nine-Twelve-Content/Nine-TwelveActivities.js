import React, { useState } from "react";
import HospitalMap from '../../assets/images/HospitalMap.png'
import '../../assets/Styles/Activities.css'

import SideImageLeft from "../../assets/images/activity/chute.png"
import SideImageLeft2 from "../../assets/images/activity/girlpainting.png"
import SideImageLeft3 from "../../assets/images/activity/monkeybars.png"
import SideImageLeft4 from "../../assets/images/activity/pottery.png"
import SideImageRight from "../../assets/images/activity/teenpark.png"
import SideImageRight2 from "../../assets/images/activity/teacher.png"
import SideImageRight3 from "../../assets/images/activity/paint.png"
import SideImageRight4 from "../../assets/images/activity/paint-tube.png"

export default function NineTwelveActivities({ setView, patient }) {

  return (
    <div>
      <div className="activities-wrapper">
        {/* Left side images */}
        <div className="side-column left">
          <img src={SideImageLeft} alt="Chute" />
          <img src={SideImageLeft2} alt="Girl painting" />
          <img src={SideImageLeft3} alt="Climbing frame" />
          <img src={SideImageLeft4} alt="Pottery" />
        </div>
        <div className="child-friendly-container-activities">
          <p className="child-friendly-greeting">
            Hi {patient ? patient.first_name : "there"}! Hope you’re having a great day! 🌟
          </p>
          <p className="child-friendly-greeting">The FunPark area of the hospital is full of exciting things to do. You can explore interactive games, challenge yourself at activity stations, and check out cool zones where you can have fun and hang out with friends or family</p>
          <p className="child-friendly-greeting">If you’re feeling extra energetic, the FunPark also has some thrilling rides and fun challenges to try.</p>
          <p className="child-friendly-greeting">You will find the location of FunPark on the interactive map below.</p>
          <div className="footer-item" onClick={() => setView("Map")}>
              <img src={HospitalMap} alt="Illustration of Hospital" />
              <span>Hospital Map</span>
          </div>
        </div>

          
        {/* Right side image */}
        <div className="side-column right">
          <img src={SideImageRight} alt="Playpark" />
          <img src={SideImageRight2} alt="Art teaches" />
          <img src={SideImageRight3} alt="Paint brushes" />
          <img src={SideImageRight4} alt="Tubes of paint" />
        </div> 
      </div>
    </div>
  )
}
