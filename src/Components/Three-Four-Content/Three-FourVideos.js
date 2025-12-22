import React, { useState } from "react";

// ---- Import thumbnails and styles as needed ---- //
import peppapigThumbnail from "../../assets/images/2-4-videos-images/peppapigThumbnail.png";
import blueyThumbnail from "../../assets/images/2-4-videos-images/blueyThumbnail.png";
import blippiThumbnail from "../../assets/images/2-4-videos-images/blippiThumbnail.png";
import cocomelonThumbnail from "../../assets/images/2-4-videos-images/cocomelonThumbnail.png";
import sesamestreetThumbnail from "../../assets/images/2-4-videos-images/sesamestreetThumbnail.png";
import babysharkThumbnail from "../../assets/images/2-4-videos-images/babysharkThumbnail.png";

//--- Import CSS ---//
import '../../assets/Styles/Three-FourVideos.css';

const videos = [
  {
    title: "Peppa Pig Official Channel",
    image: peppapigThumbnail,
    link: "https://www.youtube.com/@PeppaPigOfficial"
  },
  {
    title: "CoComelon - Nursery Rhymes",
    image: cocomelonThumbnail,
    link: "https://www.youtube.com/@CoComelon"
  },
  {
    title: "Blippi - Educational Videos",
    image: blippiThumbnail,
    link: "https://www.youtube.com/@Blippi"
  },
  {
    title: "Baby Shark Dance",
    image: babysharkThumbnail,
    link: "https://www.youtube.com/watch?v=XqZsoesa55w"
  },
  {
    title: "Sesame Street Full Episodes",
    image: sesamestreetThumbnail,
    link: "https://www.youtube.com/@SesameStreet"
  },
  {
    title: "Bluey Full Episodes",
    image: blueyThumbnail,
    link: "https://www.youtube.com/@OfficialBlueyTV"
  }
];


// --- Define the component ---
const ThreeFourVideosPage = () => {
  return (
    // Use a specific parent class for this page
    <div className="videos-page">
      <h1>Fun Videos for Kids 📺</h1>

      {/* The grid that will display the video cards */}
      <div className="videos-grid">

        {/* Use .map() to create a card for each video in our array */}
        {videos.map((video, index) => (

          // Each card is a link that opens in a new tab
          <a
            key={index} // A unique 'key' is necessary in React for lists
            href={video.link}
            target="_blank" // Opens the link in a new tab
            rel="noopener noreferrer" // A security best practice for target="_blank"
            className="video-card"
          >
            {/* The video's thumbnail image */}
            <img src={video.image} alt={video.title} />

            {/* The video's title */}
            <h2>{video.title}</h2>
          </a>
        ))}

      </div>
    </div>
  );
};

export default ThreeFourVideosPage;