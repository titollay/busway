import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Contact from "./compsants/Contact";
import Services from "./compsants/Services";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services/>} />
        <Route path="/contact" element={<Contact/>} />
      </Routes>
    </>
  );
}

export default App;