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


export default function Footer() {
  return (
    <div>
      <footer>
        <div className="footer-container">
          <div className="hospital-map">
            <img src={HospitalMap} alt="Illustration of Hospital"/>
            <span>Hospital Map</span>
          </div>
          
            <ul className="footer-menu">
              <li>
                <img src={GamesLogo} alt="Snakes and Ladders illustration"/>
                <span>Games</span>
              </li>
              <li>
                <img src={FunVideos} alt="Illustration of videos"/>
                <span>Fun Videos</span>
              </li>
              <li>
                <img src={Activities} alt="Illustration of girl"/>
                <span>Activities</span>
              </li>
              <li>
                <img src={QuizLogo} alt="Illustration of quiz questions"/>
                <span>Quiz</span>
              </li>
            </ul>
          
          <div className="social-media-icons">
            <ul>
              <li>
                <img src={FacebookLogo} alt="Facebook Logo"/>
                
              </li>
              <li>
                <img src={XLogo} alt="X Logo"/>
                
              </li>
              <li>
                <img src={TicTokLogo} alt="TicTok Logo"/>
                
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

