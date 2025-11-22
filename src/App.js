import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./Pages/Welcome";
import AdminDashboard from "./Pages/AdminDashboard";
import ParentDashboard from "./Pages/ParentDashboard";
import Portal from "./Pages/Portal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/patient-portal" element={<Portal />} />
      </Routes>
    </Router>
  );
}

export default App;
