import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../../assets/Styles/Content.css'

import ambulance from '../../assets/images/ambulance.png'
import clinic from '../../assets/images/2-4 year icons/clinic.png'
import Xray from '../../assets/images/2-4 year icons/xray.png'
import mri from '../../assets/images/2-4 year icons/mri.png'
import surgical from '../../assets/images/2-4 year icons/surgical.png'
import ward from '../../assets/images/2-4 year icons/ward.png'
import playarea from '../../assets/images/2-4 year icons/play area.png'

export default function ThreeFourContent({ patientId }) {
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
      info: "An X-ray is a special camera that lets doctors see inside your body. You’ll just need to stand still for a minute, like a superhero pose, and you can hold a toy to feel calm. The machine makes a small clicking sound, but it’s not scary. The doctor will take a picture of your bones to help you feel better, then you can go back to playing!" },
      
    { src: mri, alt: 'MRI Scan', 
      title: 'MRI Scan', 
      info:"An MRI takes pictures of your body, like a superhero camera! You’ll lie on a comfy bed and stay still while the machine makes loud knocking sounds. It might look like a tunnel, but it’s safe. You can wear earplugs or headphones to help you relax. The doctor or nurse will be with you, and soon you’ll be all done and ready to play again!" },

    { src: clinic, alt: 'Clinic', 
      title: 'Clinic', 
      info: "Going to the clinic is like visiting a friendly doctor! You might wait with toys or cartoons. When it’s your turn, the doctor will check your heart, height, weight, and tummy. If you need a quick shot, it’s over fast, and you’ll get a sticker or fun band-aid! The doctor will explain everything, and when you're done, you can go home with a special treat for being brave!" },

    { src: ward, alt: 'Patient Ward', 
      title: 'Patient Ward', 
      info: "If you're not feeling well, you might stay in a cozy patient ward with a comfy bed and soft blankets. The doctor or nurse will make sure you're comfortable, and you can bring a stuffed animal or play with toys. They’ll check on you, listen to your heart, and give you medicine if needed. It’s okay to feel nervous—they’re there to help you feel safe. Soon, you'll feel better and be ready to play again!" },

    { src: playarea, alt: 'Play Area', 
      title: 'Play Area', 
      info: "A play area is a fun place to run, jump, and play with toys! You can climb blocks, slide down slides, or play with cars and dolls. There might be a ball pit to jump in too! Take a snack break, then back to playing. It’s safe, and you can ask a grown-up for help. When it’s time to go, say goodbye to your friends and get ready for more fun next time!" },

    { src: surgical, alt: 'Surgical Theatre', 
      title: 'Surgical Theatre', 
      info: "A surgical theatre is where doctors help you feel better by fixing something inside your body. You’ll be asleep the whole time and feel safe when you wake up. The doctors wear special clothes to keep everything clean, and they’ll give you a warm blanket. After surgery, you’ll be in a comfy bed with your parents, and the nurses will help you feel better. Soon, you’ll be ready to play again!"}
  ];

  // Fetch patient info when patientId prop changes
  useEffect(() => {
  if (!patientId) return;

  fetch(`http://localhost:4000/patients/${patient.patient_id}`)
    .then(res => res.json())
    .then(data => setPatient(data))
    .catch(err => console.error("Error fetching patient info:", err));
}, [patient?.patient_id]);

  //profile info
  return (
    <div className="portal-layout">
      <aside className="profile-panel">
        <img
          src={ambulance}
          alt="Profile"
          className="profile-image"
        />
        <div className="profile-info">
          <h3 className="profile-name">{patient?.first_name} {patient?.last_name}</h3>
          <p className="profile-age">Age: {patient?.age}</p>
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