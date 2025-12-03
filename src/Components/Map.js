import React, { useState } from "react";
import Hospital from "../assets/images/hospital.png";
import "../assets/Styles/Map.css";

function Map() {
  const [activeMarker, setActiveMarker] = useState(null);

  const markerPositions = {
    X_ray: { top: "25%", left: "35%", color: "red" },
    Neurology: { top: "26%", left: "56%", color: "blue" },
    Dental: { top: "45%", left: "70%", color: "yellow" },
    MainDoor: { top: "75%", left: "30%", color: "teal" },
    Cafe: { top: "65%", left: "60%", color: "purple" },
    FunPark: { top: "45%", left: "30%", color: "orange" },
  };

  return (
    <div className="map-wrapper">
      {/* Side Table with Departments */}
      <div className="department-list">
        <h3>Departments</h3>
        {Object.keys(markerPositions).map((key) => (
          <div
            key={key}
            className={`department-item ${activeMarker === key ? "active" : ""}`}
            onClick={() => setActiveMarker(key)}
            style={{ borderLeft: `4px solid ${markerPositions[key].color}` }}
          >
            {key.replace("_", " ")}
          </div>
        ))}
      </div>

      {/* Map With Peg Markers */}
      <div className="map-container">
        <img src={Hospital} alt="Hospital Map" className="map-image" />

        {Object.keys(markerPositions).map((key) => (
          <div
            key={key}
            className={`marker ${activeMarker === key ? "active bounce" : ""}`}
            style={{
              top: markerPositions[key].top,
              left: markerPositions[key].left,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div
              className="peg-head"
              style={{ backgroundColor: markerPositions[key].color }}
            ></div>
            <div
              className="peg-body"
              style={{ backgroundColor: markerPositions[key].color }}
            ></div>
            <div
              className="marker-label"
              style={{ borderColor: markerPositions[key].color }}
            >
              {key.replace("_", " ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Map;
