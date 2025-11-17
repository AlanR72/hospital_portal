import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./Pages/Welcome";
import Admin from "./Pages/Admin";
import Parent from "./Pages/Parent";
import Portal from "./Pages/Portal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/admin-dashboard" element={<Admin />} />
        <Route path="/parent-dashboard" element={<Parent />} />
        <Route path="/patient-portal" element={<Portal />} />
      </Routes>
    </Router>
  );
}

export default App;
