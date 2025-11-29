import React, { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'
import '../../assets/Styles/Content.css'


import clinic from '../../assets/images/9-12 year icons/clinic.png'
import Xray from '../../assets/images/9-12 year icons/xray.png'
import mri from '../../assets/images/9-12 year icons/mri.png'
import surgical from '../../assets/images/9-12 year icons/surgical.png'
import ward from '../../assets/images/9-12 year icons/ward.png'
import playarea from '../../assets/images/9-12 year icons/playarea.png'

export default function NineTwelveContent({patientId}) {
  // State to track which grid item is active (clicked)
  const [activeItem, setActiveItem] = useState(null);
  // State for patient info
  const [patient, setPatient] = useState(null);

  // Function to toggle between image and text
  const handleToggle = (index) => {
    setActiveItem(activeItem === index ? null : index);  // If already active, hide it, else show it
  };

  // Array to hold the details for each item (image, title, and info)
  const gridItems = [
    { src: Xray, alt: 'Xray', 
      title: 'X-Ray', 
      info: "An X-ray is a special kind of camera that can see things inside your body, like your bones and even if something is in the wrong place. It works kind of like taking a picture, but you won’t feel anything at all. You just stand or lie still for a moment while the machine takes the picture. Doctors use X-rays to understand what’s going on so they can help you get better faster." },
      
    { src: mri, alt: 'MRI Scan', 
      title: 'MRI Scan', 
      info:"An MRI is a big machine shaped like a donut that takes super-detailed pictures of the inside of your body. It uses magnets and sounds—so it might be a little noisy—but it never touches you or hurts. You get to lie on a comfy bed that slides into the machine, and sometimes you can even listen to music while it works. The pictures help doctors see things that are too small for regular cameras." },

    { src: clinic, alt: 'Clinic', 
      title: 'Clinic', 
      info: "A clinic is a friendly place inside the hospital where you go for check-ups, appointments, and to talk to doctors and nurses. It’s usually bright and welcoming, with people who want to help you feel your best. You might get weighed, have your height measured, or answer simple questions about how you’re feeling. The clinic is where the hospital team gets to know you and helps make a plan to keep you healthy." },

    { src: ward, alt: 'Patient Ward', 
      title: 'Patient Ward', 
      info: "The patient ward is a cozy area where kids stay when they need to be in the hospital for more than a quick visit. You get your own bed, and sometimes a TV or space for your favourite things from home. Nurses check on you often to make sure you’re comfortable and feeling okay. There are also places to play, relax, or read, so even though you’re in the hospital, you can still have fun and feel cared for." },

    { src: playarea, alt: 'Play Area', 
      title: 'Play Area', 
      info: "The play area is a special spot designed just for kids. It’s filled with toys, books, games, and sometimes craft tables or video games. It’s a place where you can go to have fun, make new friends, and take a break from medical stuff. Friendly play specialists are often there to help you choose activities or show you something new to try so you can feel happy and relaxed." },

    { src: surgical, alt: 'Surgical Theatre', 
      title: 'Surgical Theatre', 
      info: "A surgical theatre is a super-clean, high-tech room where doctors do special operations to fix problems inside the body. Before you go in, you’ll meet the team who will take care of you, and they’ll explain everything in a way that’s easy to understand. You’ll get medicine that gently puts you to sleep so you won’t feel or remember anything during the surgery. While you’re resting, the doctors and nurses work together like a team to help make you healthier."}
  ];

  // Fetch patient info when patientId prop changes
    useEffect(() => {
      if (!patientId) return;
  
      fetch(`http://localhost:4000/patients/${patientId}`) // adjust if your route is /api/patients
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(data => setPatient(data))
        .catch(err => console.error("Error fetching patient info:", err));
    }, [patientId]);

  //profile info
  return (
    <div className="portal-layout">
      <aside className="profile-panel">
        <img
          src={patient?.photo_url}
          alt="Profile"
          className="profile-image"
        />
        <div className="profile-info">
          <h3 className="profile-name">{patient ? `${patient.first_name} ${patient.last_name}` : "Loading..."}</h3>
          <p className="profile-age">Age: {patient ? patient.age : "..."}</p>
        </div>
      </aside>

      <div className="content-grid">
        {gridItems.map((item, index) => (
          <div key={index} className="grid-item" onClick={() => handleToggle(index)}>
            <Link to={item.link} className="grid-link">
              {/* Conditionally render image or info based on active item */}
              {activeItem === index ? (
                <div className="info">
                  <h2>{item.title}</h2>
                  <p>{item.info}</p>
                </div>
              ) : (
                <>
                  <img src={item.src} alt={item.alt} />
                  <h3 className="image-title">{item.title}</h3> {/* Title below the image */}
                  <h4 className="click-me">Click Me</h4> {/* Second title below the first title */}
                </>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}