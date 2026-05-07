import Hero from "../components/sections/heroSection";
import About from "../components/sections/About1";
import Services from "../components/sections/Services";
import Contact from "../components/sections/Contact";
import Parallax1 from "../parallax/parallax1";
import wallpaper from "../assets/wall.webp";
import Testimonials from "../components/sections/Testimonials";

export default function Home() {
  return (
    <main className="min-h-screen text-white">

      <div
        className="bg-cover bg-no-repeat relative"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(7,3,32,1)), url(${wallpaper})` }}
      >
        <Hero />
      </div>

      <About />

      <div className="relative z-20">
        <Parallax1 sectionName={"Nos Services"} />
      </div>

      <Services />
      <Testimonials />
      <Contact />

    </main>
  );
}