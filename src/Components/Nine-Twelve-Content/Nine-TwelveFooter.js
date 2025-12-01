import React from 'react'
import "../../assets/Styles/Footer.css";

import HospitalMap from '../../assets/images/HospitalMap.png'
import GamesLogo from '../../assets/images/9-12 games.png'
import FunVideos from '../../assets/images/9-12 videos.png'
import Activities from '../../assets/images/9-12 activity.png'
import QuizLogo from '../../assets/images/quizlogo.png'
import FacebookLogo from '../../assets/images/facebook.png'
import XLogo from '../../assets/images/x.png'
import TicTokLogo from '../../assets/images/tiktok.png'


export default function Footer({setView}) {
  return (
    //The <footer> ~HTML5 semantic tag is used for better accessibility and SEO.
    <footer className='footer-container'>

      {/* Group 1: Hospital Map */}
      <div className="footer-item" onClick={() => setView("Map")}>
        <img src={HospitalMap} alt="Illustration of Hospital" />
        <span>Hospital Map</span>
      </div>

      {/* Group 2: Main Menu Items */}
      <div className="footer-item" onClick={() => setView("Games")}>
        <img src={GamesLogo} alt="GameController" />
        <span>Games</span>
      </div>
      <div className="footer-item" onClick={() => setView("Videos")}>
        <img src={FunVideos} alt="YouTube style TV icon" />
        <span>Fun Videos</span>
      </div>
      <a href='/activities' className="footer-item">
        <img src={Activities} alt="" />
        <span>Activities</span>
      </a>
      <a href='/quiz' className="footer-item">
        <img src={QuizLogo} alt="Illustration of quiz questions" />
        <span>Quiz</span>
      </a>

      {/* Group 3: Social Media Icons. Placed within a div for easier styling. */}
      <div className="social-media-icons">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"  >
          <img src={FacebookLogo} alt="Facebook Logo" />
        </a>

        <a href="https://x.com" target="_blank" rel="noopener noreferrer"  >
          <img src={XLogo} alt="X Logo" />
        </a>

        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"  >
          <img src={TicTokLogo} alt="TicTok Logo" />
        </a>
      </div>
    </footer >
  )
}

