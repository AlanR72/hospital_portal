import React from 'react'
import "../../assets/Styles/Footer.css";

import HospitalMap from '../../assets/images/HospitalMap.png'
import GamesLogo from '../../assets/images/snakesandladderslogo.png'
import FunVideos from '../../assets/images/funvideoslogo.png'
import Activities from '../../assets/images/girllogo.png'
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
        <img src={GamesLogo} alt="Snakes and Ladders" />
        <span>Games</span>
      </div>
      <div className="footer-item" onClick={() => setView("Videos")}>
        <img src={FunVideos} alt="Snakes and Ladders" />
        <span>Fun Videos</span>
      </div>
      <a href="/activities" className="footer-item">
        <img src={Activities} alt="Illustration of girl" />
        <span>Activities</span>
      </a>
      <a href="/quiz" className="footer-item">
        <img src={QuizLogo} alt="Illustration of quiz questions" />
        <span>Quiz</span>
      </a>

      {/* Group 3: Social Media Icons. Placed within a div for easier styling. */}
      <div className="social-media-icons">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <img src={FacebookLogo} alt="Facebook Logo" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <img src={XLogo} alt="X Logo" />
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
          <img src={TicTokLogo} alt="TikTok Logo" />
        </a>
      </div>
    </footer >
  )
}

