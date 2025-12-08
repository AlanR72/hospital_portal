import React from 'react'

import quiz1 from "../../assets/images/quizImages/quiz1.PNG";
import quiz2 from "../../assets/images/quizImages/quiz1.1.PNG";
import quiz3 from "../../assets/images/quizImages/quiz2.png";
import quiz4 from "../../assets/images/quizImages/quiz2.1.png";
import quiz5 from "../../assets/images/quizImages/quiz3.png";
import quiz6 from "../../assets/images/quizImages/quiz3.1.png";

export default function NineTwelveQuiz() {
  return (
    <div>
      <div className="child-friendly-container">
        <p className="child-friendly-greeting">
          Hi! Hope you’re having a great day! 🌟
        </p>
        <p className="child-friendly-greeting">Why not try one of our below interactive quizzes?</p>
        <div className= "quiz1">
        <img src={quiz1}/>
        <img src={quiz2}/>
        <label>Space Academy</label>
        </div>
        <div className= "quiz2">
        <img src={quiz3}/>
        <img src={quiz4}/>
        <label>Teen Quiz</label>
        </div>
        <div className= "quiz3">
        <img src={quiz5}/>
        <img src={quiz6}/>
        <label>Quiz4Kidz</label>
        </div>
        
      </div>
    </div>
  )
}
