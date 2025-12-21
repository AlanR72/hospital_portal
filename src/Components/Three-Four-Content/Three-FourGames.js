import React, { useState } from "react";
import '../../assets/Styles/GamesPage.css';
import GamesLogo from '../../assets/images/snakesandladderslogo.png'
import coolmathgames from '../../assets/images/coolmathsgames.png';
import mathplayground from '../../assets/images/mathplayground.png';
import pbskids from '../../assets/images/pbskids.png';
import funbrain from '../../assets/images/funbrain.png';

const games = [
  {
    title: "Cool Math Game",
    image: coolmathgames,
    link: "https://www.coolmathgames.com/"
  },
  {
    title: "Math Playground",
    image: mathplayground,
    link: "https://www.mathplayground.com/"
  },
  {
    title: "PBS Kids Games",
    image: pbskids,
    link: "https://pbskids.org/games/"
  },
  {
    title: "Funbrain Games",
    image: funbrain,
    link: "https://www.funbrain.com/games"
  },
  {
    title: "Papa's Freezeria",
    image: coolmathgames,
    link: "https://www.coolmathgames.com/0-papas-freezeria"
  },
  {
    title: "Run 3",
    image: coolmathgames,
    link: "https://www.coolmathgames.com/0-run-3"
  },
  {
    title: "Cookie Clicker",
    image: coolmathgames,
    link: "https://www.coolmathgames.com/0-cookie-clicker"
  },
  {
    title: "Jelly Truck",
    image: coolmathgames,
    link: "https://www.coolmathgames.com/0-jelly-truck"
  }
];

const GamesPage = () => {
  return (
    <div className="games-page">
      <h1>Fun Games Websites 🎮</h1>
      <div className="games-grid">
        {/* First 4 games */}
        {games.slice(0, 4).map((game, index) => (
          <a
            key={index}
            href={game.link}
            target="_blank"
            rel="noopener noreferrer"
            className="game-card"
          >
            <img src={game.image} alt={game.title} />
            <h2>{game.title}</h2>
          </a>
        ))}

        {/* Insert heading here */}
        <h2 className="recommended-heading">Recommended Games 🕹️</h2>

        {/* Remaining games */}
        {games.slice(4).map((game, index) => (
          <a
            key={index + 4}
            href={game.link}
            target="_blank"
            rel="noopener noreferrer"
            className="game-card"
          >
            <img src={game.image} alt={game.title} />
            <h2>{game.title}</h2>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;


