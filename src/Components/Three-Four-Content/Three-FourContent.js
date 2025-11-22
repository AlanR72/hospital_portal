import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/Styles/Content.css';

import ambulance from '../../assets/images/ambulance.png';
import clinic from '../../assets/images/2-4 year icons/clinic.png';
import Xray from '../../assets/images/2-4 year icons/xray.png';
import mri from '../../assets/images/2-4 year icons/mri.png';
import surgical from '../../assets/images/2-4 year icons/surgical.png';
import ward from '../../assets/images/2-4 year icons/ward.png';
import playarea from '../../assets/images/2-4 year icons/play area.png';

export default function ThreeFourContent({ patient }) {

  const [activeItem, setActiveItem] = useState(null);

  const handleToggle = (index) => {
    setActiveItem(activeItem === index ? null : index);
  };

  const gridItems = [
    { src: Xray, alt: 'Xray', title: 'X-Ray',
      info: "An X-ray is a special camera that lets doctors see inside your body..." },

    { src: mri, alt: 'MRI Scan', title: 'MRI Scan',
      info: "An MRI takes pictures of your body, like a superhero camera..." },

    { src: clinic, alt: 'Clinic', title: 'Clinic',
      info: "Going to the clinic is like visiting a friendly doctor..." },

    { src: ward, alt: 'Patient Ward', title: 'Patient Ward',
      info: "If you're not feeling well, you might stay in a cozy ward..." },

    { src: playarea, alt: 'Play Area', title: 'Play Area',
      info: "A play area is a fun place to run, jump, and play with toys..." },

    { src: surgical, alt: 'Surgical Theatre', title: 'Surgical Theatre',
      info: "A surgical theatre is where doctors help you feel better..." }
  ];

  if (!patient)
    return <p>Loading patient info...</p>;

  return (
    <div className="portal-layout">

      <aside className="profile-panel">
        <img src={ambulance} alt="Profile" className="profile-image" />

        <div className="profile-info">
          <h3 className="profile-name">
            {patient.first_name} {patient.last_name}
          </h3>
          <p className="profile-age">Age: {patient.age}</p>
        </div>
      </aside>

      <div className="content-grid">
        {gridItems.map((item, index) => (
          <div key={index} className="grid-item" onClick={() => handleToggle(index)}>
            <Link className="grid-link">

              {activeItem === index ? (
                <div className="info">
                  <h2>{item.title}</h2>
                  <p>{item.info}</p>
                </div>
              ) : (
                <>
                  <img src={item.src} alt={item.alt} />
                  <h3 className="image-title">{item.title}</h3>
                  <h4 className="click-me">Click Me</h4>
                </>
              )}

            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}
