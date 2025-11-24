import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import langsideLogo from "../assets/images/langside-logo.png";
import portalLogo from "../assets/images/portal_logo1.png";
import uponarrival from "../assets/images/uponarrival.PNG";
import prescription from "../assets/images/Prescription.PNG";
import research from "../assets/images/researchstudies.PNG";
import calendar from "../assets/images/Calendar.PNG";
import testube from "../assets/images/testube.PNG";
import communicate from "../assets/images/communicatelogo.png";
import "../assets/Styles/Welcome.css";


export default function Welcome() {
  const [role, setRole] = useState("patient");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }) // no role
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    // Save user info
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);
    if (data.patient_id) localStorage.setItem("patientId", data.patient_id);
    
    if (data.age_group) {
      localStorage.setItem("age_group", data.age_group);
    }

    // Redirect based on backend validation
    if (data.canAccessAdmin) {
      navigate("/admin-dashboard");
    } else if (data.role === "parent") {
      navigate("/parent-dashboard");
    } else if (data.role === "patient") {
      navigate("/patient-portal");
    } else {
      setError("Unknown user role");
    }

  } catch (err) {
    console.error("Login error:", err);
    setError("An error occurred while logging in.");
  }
};


  return (
    <div className="page-container">
      {/* This new wrapper is the "box" that will be centered */}
      <div className="content-wrapper">
        <header className="page-header">
          <div className="logo">
            <a id="logo" href="/">
              <img src={langsideLogo} alt="Hospital Logo" />
            </a>
          </div>
          <div className="welcome-heading">
            <h1>Welcome to Langside Children's Hospital</h1>
            {/* I removed the <br/> for better semantic spacing controlled by CSS */}
            <h3>Your health and happiness are our top priorities!</h3>
          </div>
        </header>

        <main className="main-container">
          <div className="info-section">
            <div className="icon-container">
              {/* ... (all your icon items) ... */}
              <div className="icon-item">
                <img src={uponarrival} alt="Drawing of hospital" />
                <span>Arrival Instructions</span>
              </div>
              <div className="icon-item">
                <img src={prescription} alt="Drawing of pills" />
                <span>Prescriptions</span>
              </div>
              <div className="icon-item">
                <img src={research} alt="Drawing of microscope" />
                <span>Research</span>
              </div>
              <div className="icon-item">
                <img src={calendar} alt="Drawing of calendar" />
                <span>Appointments Calendar</span>
              </div>
              <div className="icon-item">
                <img src={testube} alt="Drawing of testube" />
                <span>Test Results</span>
              </div>
              <div className="icon-item">
                <img src={communicate} alt="Drawing of hospital" />
                <span>Communicate with Doctor</span>
              </div>
            </div>
          </div>

          <div className="portal-login-section">
            {/* Hide logo on mobile */}
            <img src={portalLogo} alt="Childrens Portal Logo" className="hide-on-mobile" />
            <h2>Portal Login</h2>
            <form onSubmit={handleLogin}>
            <label>Login As:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="patient">Patient</option>
              <option value="parent">Parent/Guardian</option>
              <option value="doctor">Doctor/Admin</option>
            </select>
            <input
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          </form>

          </div>
        </main>
      </div> {/* End of content-wrapper */}
    </div>
  );
}


