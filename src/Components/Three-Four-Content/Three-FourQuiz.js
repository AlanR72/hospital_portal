import React from 'react'

import quiz1 from "../../assets/images/quizImages/quiz1.PNG";
import quiz2 from "../../assets/images/quizImages/quiz1.1.PNG";
import quiz3 from "../../assets/images/quizImages/quiz2.png";
import quiz4 from "../../assets/images/quizImages/quiz2.1.png";
import quiz5 from "../../assets/images/quizImages/quiz3.png";
import quiz6 from "../../assets/images/quizImages/quiz3.1.png";

import '../../assets/Styles/Quiz.css'

export default function ThreeFourQuiz({patient}) {
  return (
    <div>
      <div className="child-friendly-container-quiz">
        <p className="child-friendly-greeting">
          Hi {patient ? patient.first_name : "there"}! Hope you’re having a great day! 🌟
        </p>
        <p className="child-friendly-greeting">Why not try one of our below interactive quizzes?</p>
        <div className="quiz-container">

          <a className="quiz" href="https://quizassessement.netlify.app" target="_blank" rel="noopener noreferrer">
            <div className="quiz-images">
              <img src={quiz1} />
              <img src={quiz2} />
            </div>
            <p className="quiz-label">Space Academy</p>
          </a>

          <a className="quiz" href="https://quiz4teens.netlify.app/ " target="_blank" rel="noopener noreferrer">
            <div className="quiz-images">
              <img src={quiz3} />
              <img src={quiz4} />
            </div>
            <p className="quiz-label">Teen Quiz</p>
          </a>

          <a className="quiz" href="https://quiz4kidzkm.netlify.app/" target="_blank" rel="noopener noreferrer">
            <div className="quiz-images">
              <img src={quiz5} />
              <img src={quiz6} />
            </div>
            <p className="quiz-label">Quiz4Kidz</p>
          </a>

        </div>
      </div>
    </div>
  )
}
