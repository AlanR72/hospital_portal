import React, { useState } from "react";
import HospitalMap from '../../assets/images/HospitalMap.png'
import '../../assets/Styles/Activities.css'



export default function NineTwelveActivities({ setView }) {

  return (
    <div>
      <div className="child-friendly-container">
        <p className="child-friendly-greeting">
          Hi! Hope you’re having a great day! 🌟
        </p>
        <p className="child-friendly-greeting">The FunPark area of the hospital is full of exciting things to do. You can explore interactive games, challenge yourself at activity stations, and check out cool zones where you can have fun and hang out with friends or family</p>
        <p className="child-friendly-greeting">If you’re feeling extra energetic, the FunPark also has some thrilling rides and fun challenges to try.</p>
        <p className="child-friendly-greeting">You will find the location of FunPark on the interactive map below.</p>
        <div className="footer-item" onClick={() => setView("Map")}>
            <img src={HospitalMap} alt="Illustration of Hospital" />
            <span>Hospital Map</span>
        </div>
      </div>
    </div>
  )
}

