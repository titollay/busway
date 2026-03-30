import { Routes, Route } from "react-router-dom";

import Footer from "./Footer";
import About from "./About1";

import Contact from "./compsants/Contact";
import Services from "./compsants/Services";



function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services/>} />
        <Route path="/contact" element={<Contact/>} />

      </Routes>
      <About/>
      <Footer />
    </>
  );
}

export default App;