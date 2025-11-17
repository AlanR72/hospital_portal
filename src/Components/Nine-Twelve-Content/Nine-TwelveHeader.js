import React from 'react'
import '../../assets/Styles/Header.css';

import portalLogo from "../../assets/images/portal_logo1.png";
import homeIcon from "../../assets/images/nine-twelvehome.png"
import calendarIcon from "../../assets/images/nine-twelvecalendar.png"
import medicineIcon from "../../assets/images/nine-twelvemedicine.png"
import teamIcon from "../../assets/images/nine-twelveteam.png"

export default function NineTwelveHeader() {
  return (
    <div>
          <nav className="nav-container">
      <div className="portal-logo">
        <a id="logo" href="/Portal">
          <img src={portalLogo} alt="Hospital Logo" />
        </a>
      </div>
    
      <ul className="portal-menu">
        <li>
          <img src={homeIcon} alt="Home icon" />
          <span>Home</span>
        </li>
        <li>
          <img src={calendarIcon} alt="Calendar icon" />
          <span>My Calendar</span>
        </li>
        <li>
          <img src={medicineIcon} alt="Medicine icon" />
          <span>My Medicine</span>
        </li>
        <li>
          <img src={teamIcon} alt="Team icon" />
          <span>Medical Team</span>
        </li>
      </ul>
    </nav>
          
        </div>
      );
    }
 
