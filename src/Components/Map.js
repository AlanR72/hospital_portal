import React, { useState } from "react";
import Hospital from "../assets/images/hospital.png";
import "../assets/Styles/Map.css";

export default function Map() {
  const [activeMarker, setActiveMarker] = useState(null);

  const markerPositions = {
    X_ray: { top: "25%", left: "35%", color: "#FF3B3B" },
    Neurology: { top: "26%", left: "56%", color: "#007BFF" },
    Dental: { top: "45%", left: "70%", color: "#FFD700" },
    MainDoor: { top: "75%", left: "30%", color: "#00CED1" },
    Cafe: { top: "65%", left: "60%", color: "#A020F0" },
    FunPark: { top: "45%", left: "30%", color: "#FF8C00" }
  };

  return (
    <div className="map-wrapper">
      <div className="map-container">

        {/* Floating Key */}
        <div className="department-key">
          <h3>Departments</h3>
          {Object.keys(markerPositions).map((key) => (
            <div
              key={key}
              className={`department-item ${
                activeMarker === key ? "active" : ""
              }`}
              onClick={() => setActiveMarker(key)}
              style={{ borderLeft: `4px solid ${markerPositions[key].color}` }}
            >
              {key.replace("_", " ")}
            </div>
          ))}
        </div>

        {/* Map Image */}
        <img src={Hospital} alt="Hospital Map" className="map-image" />

        {/* Moving Peg Marker */}
        {activeMarker && (
          <div
            className="marker active-marker"
            style={{
              top: markerPositions[activeMarker].top,
              left: markerPositions[activeMarker].left,
              transform: "translate(-50%, -100%)"
            }}
          >
            <div
              className="peg-head"
              style={{ backgroundColor: markerPositions[activeMarker].color }}
            ></div>
            <div
              className="peg-body"
              style={{ backgroundColor: markerPositions[activeMarker].color }}
            ></div>
          </div>
        )}

      </div>
    </div>
  );
}
