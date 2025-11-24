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
      info: "An X-ray camera takes a picture of your bones! You just have to stand very still for a moment, like a statue. It's quick, it doesn't hurt, and then you can go play!"},

    { src: mri, alt: 'MRI Scan', title: 'MRI Scan',
      info: "You get to lie down on a comfy bed that slides into a tunnel. The machine makes loud tapping sounds, like a drum! You can wear special headphones. The doctors are right there with you."},

    { src: clinic, alt: 'Clinic', title: 'Clinic',
      info: "At the clinic, a friendly doctor will check if you are growing strong! They might listen to your heart. If you need a tiny poke, it's super fast, and you get a cool sticker for being brave!"},

    { src: ward, alt: 'Patient Ward', title: 'Patient Ward',
      info: "This is your cozy room if you need to stay for a little while. You get your own bed, and you can bring your favorite toys! The nurses are there to help you feel comfy and safe." },

    { src: playarea, alt: 'Play Area', title: 'Play Area',
      info: "The play area is a super fun room with toys, slides, and blocks! You can make new friends and play lots of games. It's a happy place to have fun while you're at the hospital." },

    { src: surgical, alt: 'Surgical Theatre', title: 'Surgical Theatre',
      info: "This is a special room where doctors help you while you're taking a nap. You won't feel anything at all! When you wake up, you'll be in your cozy bed with your family." }
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
