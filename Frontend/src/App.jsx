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
import IndexAdmin from "./pages/admin/index";
import DashboardAdmin from "./pages/admin/component/dashboard";
import FleetAdmin from "./pages/admin/component/Fleet";
import LinesAdmin from "./pages/admin/component/Lines";
import DriversAdmin from "./pages/admin/component/Drivers";
import UsersAdmin from "./pages/admin/component/Users";

// Sections
import About from "./components/sections/About1";
import Services from "./components/sections/Services";
import Contact from "./components/sections/Contact";

function App() {
  const location = useLocation();
  const hideLayout = ["/login", "/register", "/gps-conducteur", "/index", "/index/"].some(path => location.pathname.startsWith(path));

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
        
        {/* Admin Routes */}
        <Route path="/index/*" element={<IndexAdmin />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="tracking" element={<div className="p-10 text-center">Live Tracking Module Under Dev</div>} />
          <Route path="buses" element={<FleetAdmin />} />
          <Route path="lines" element={<LinesAdmin />} />
          <Route path="drivers" element={<DriversAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="settings" element={<div className="p-10 text-center">Settings Module Under Dev</div>} />
        </Route>
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;