import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Layout
import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MapUsager from "./pages/MapUsager";
import GPSConducteur from "./pages/GPSConducteur";
import Dashboard from "./pages/Dashboard";

// Sections
import About from "./components/sections/About1";
import Services from "./components/sections/Services";
import Contact from "./components/sections/Contact";

function App() {
  const location = useLocation();
  const hideLayout = ["/login", "/register", "/gps-conducteur"].includes(location.pathname);

  return (
    <>
      {!hideLayout && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/map" element={<MapUsager />} />
        <Route path="/gps-conducteur" element={<GPSConducteur />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;