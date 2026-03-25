import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Footer from "./Footer";
import About from "./About1";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <About/>
      <Footer />
    </>
  );
}

export default App;
