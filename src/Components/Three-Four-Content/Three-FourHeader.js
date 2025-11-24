//Import React and the 'useState' hook for managing component state.
import React, { useState } from "react";
//Import the component's specific stylesheet.
import "../../assets/Styles/Header.css";

//Import image assets for the navigation menu.
import portalLogo from "../../assets/images/portal_logo1.png";
import homeIcon from "../../assets/images/homelogo.png";
import clipboardIcon from "../../assets/images/clipboard.png";
import medicineIcon from "../../assets/images/medicine.png";
import medicalTeamIcon from "../../assets/images/ambulance.png";


//Define and export the 'ThreeFourHeader' functional component.
export default function ThreeFourHeader( {setView}) {
  // 1. STATE MANAGEMENT:
  // Create a state variable to track if the mobile menu is open or closed.
  // -'isMenuOpen' will be 'true' if the menu is open, 'false' otherwise.
  // -'useState(false)' initialises the state as closed by default.

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 2. EVENT HANDLER:
  // This function toggles the menu's open/closed state.
  const toggleMenu = () => {
    // setIsMeenuOpen received the opposite of the current value.
    // If IsMenuOpen is true, it become false, and vice-versa.

    setIsMenuOpen(!isMenuOpen);
  };

  // 3. JSX (RENDER LOGIC):
  return (
    // Use the <header> ~HTML5 semantic tag for better accessibility and SEO.
    <header className="header">
      <nav className="nav-container">

        {/* The site logo, which links to the portal homepage */}
       <div className="portal-logo" onClick={() => setView("Content")} 
          style={{ cursor: "pointer" }}>
        <img src={portalLogo} alt="Hospital Logo" />
        </div>

        {/* The burger menu button, visible only on mobile. */}
        {/* When clicked, it calls the 'toggleMenu' function to open/close the menu. */}
        <button className="burger-menu-button" onClick={toggleMenu}>
          &#9776;
        </button>

        {/* 
          The navigation menu. 
          A dynamic class 'open' is added using a template literal if 'IsMenuOpen' is true.
          This allows CSS to control the show/hide transition of the menu on mobile devices. 
        */}
        <div className={`portal-menu-panel ${isMenuOpen ? 'open' : ''}`}>

          {/* THE CLOSE BUTTON MUST BE *INSIDE* THE MENU PANEL */}
          <button className="close-menu-button" onClick={toggleMenu}>
            &times;
          </button>

          {/* The navigation menu items with icons */}
           <ul className="portal-menu-list">
            <li onClick={() => setView("Content")} 
              style={{ cursor: "pointer" }}>
              <img src={homeIcon} alt="Home icon" />
              <span>Home</span>
            </li>
            <li onClick={() => setView('Calendar')} 
              style={{cursor: "pointer"}}>
              <img src={clipboardIcon} alt="Calendar icon" />
              <span>My Calendar</span>
            </li>
            <li onClick={() => setView('Medicines')} 
              style={{cursor: "pointer"}}>
            <img src={medicineIcon} alt="Medicine icon" />
            <span>My Medicine</span>
            </li>
            <li onClick={() => setView("MedicalTeam")} 
              style={{ cursor: "pointer" }}>
              <img src={medicalTeamIcon} alt="Team icon" />
              <span>Medical Team</span>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

