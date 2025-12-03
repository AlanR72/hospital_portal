import React, { useState } from "react";
import HospitalMap from '../../assets/images/HospitalMap.png'
import '../../assets/Styles/Activities.css'



export default function ThreeFourActivities({ setView }) {

  return (
    <div>
      <div className="child-friendly-container">
    <p className="child-friendly-greeting">
      Hi ! Hope you're feeling happy and well today! 🌟
    </p>
    <p className="child-friendly-greeting">There are lots of cool things to explore in the FunPark area of the hospital! You can try hands-on games, colourful play zones, and plenty of places to laugh and burn off some energy. It’s the perfect spot to take a break and enjoy yourself</p>
    <p className="child-friendly-greeting">Or..if you are feeling energetic the FunPark is also full of exciting rides.</p>
    <p className="child-friendly-greeting">You will find the location of FunPark on the interactive map below.</p>
    <div className="footer-item" onClick={() => setView("Map")}>
        <img src={HospitalMap} alt="Illustration of Hospital" />
        <span>Hospital Map</span>
    </div>

    

    
  </div>
    </div>
  )
}
