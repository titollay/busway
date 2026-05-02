import { Routes, Route } from "react-router-dom";

import Footer from "./components/Footer";
import About from "./components/About1";
import Home from "./Home";

import Contact from "./components/Contact";
import Services from "./components/Services";
import Login from "./components/Login";
import Register from "./components/Register";



function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    
      
    </>
  );
}

export default App;