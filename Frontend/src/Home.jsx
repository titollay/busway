import NavBar from "./components/navBar";
import Hero from "./components/heroSection";
import wallpaper from "./assets/wall.webp";
import Parallax1 from "./parallax/parallax1";
import About from "./components/About1";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";


export default function Home() {
  return (
    <main className=" min-h-screen  text-white ">
      
     <div className="bg-cover  bg-no-repeat relative" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(7, 3, 32, 1)), url(${wallpaper})`}}>
      <div className=" relative z-60">
         <NavBar />
      </div>
       
      
       <div className="relative z-10 ">
          <Hero/>
          
        </div>
     </div>
      <div>
          <About/>
      </div>
      
      <div className="relative z-20">
        
        <Parallax1 sectionName={"Nos Services"} />
      </div>
     <div>
      <Services/>
     </div>
     <div>
        <Contact/>
     </div>
     <div>
        <Footer />
     </div>
     
      
    </main>
  );
}
