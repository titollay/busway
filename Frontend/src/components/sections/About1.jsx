import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

// ─── Assets ───────────────────────────────────────────────────────────────────
import bus1 from "../../assets/bus.webp";
import bus2 from "../../assets/bg.webp";
import bus3 from "../../assets/busRegis.webp";
import bus4 from "../../assets/bus2.webp"; 

const IMG_STYLE = { filter: "brightness(0.6) contrast(1.05)" };

const ColImg = ({ src, alt }) => (
  <div className="h-48 w-36 overflow-hidden rounded-lg shadow-lg">
    <img
      src={src}
      className="h-full w-full object-cover"
      style={IMG_STYLE}
      alt={alt}
    />
  </div>
);

const texts = [
  "Une plateforme avancée propulsée par l'IA combinant technologie de pointe et mobilité intelligente.",
  "Chaque trajet est optimisé pour la ponctualité, la sécurité et le confort des citoyens d'Oujda.",
  "Suivi en temps réel, expérience fluide et un réseau de transport en lequel vous pouvez avoir confiance.",
];

function About() {
  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end start"],
  });

  const makeAnim = (range) => ({
    y: useTransform(scrollYProgress, range, ["400px", "0px"]),
    opacity: useTransform(scrollYProgress, range, [0, 1]),
  });

  const anims = [
    makeAnim([0, 0.3]),
    makeAnim([0.3, 0.6]),
    makeAnim([0.6, 0.7]),
  ];

  const leftY = useTransform(scrollYProgress, [0, 1], ["-150px", "150px"]);
  const centerY = useTransform(scrollYProgress, [0, 1], ["150px", "-150px"]);

  return (
    <section
        id="about"
        ref={ref}
      className="darkSection bg-[#070315] max-md:overflow-hidden text-white overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      <div className="min-h-[120vh] max-md:min-h-screen relative flex items-center justify-around max-md:justify-center max-md:flex-col max-w-7xl mx-auto">
        
        {/* Left: sticky images (Exact original classes for desktop) */}
        <div className="sticky top-[10%] h-screen w-1/2 max-md:w-full max-md:h-auto max-md:top-auto max-md:pt-10 max-md:mb-10">
          <p
            id="about-us"
            className="text-xs uppercase tracking-[0.3em] text-[#3498db] mb-4"
          >
            <span className="divider-line" />
            Qui Sommes Nous
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold max-md:mb-10 text-white">
             L'Essence <span className="text-blue-500 italic">BusWay</span>
          </h2>

          <div className="m-4 max-md:m-0 max-md:h-[50vh] max-md:relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-start max-md:justify-center"
            >
              <div className="flex gap-8 ml-10 max-md:gap-4 max-md:ml-0">
                <motion.div style={{ y: leftY }} className="grid gap-4 max-md:transform-none!">
                  <ColImg src={bus3} alt="BusWay visual 1" />
                  <ColImg src={bus4} alt="BusWay visual 2" />
                </motion.div>
                <motion.div style={{ y: centerY }} className="grid gap-4 max-md:transform-none!">
                  <ColImg src={bus1} alt="BusWay visual 3" />
                  <ColImg src={bus2} alt="BusWay visual 4" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: animated text blocks (Exact original classes for desktop, hidden on mobile) */}
        <div className="flex flex-col gap-[10vh] max-md:gap-[4vh] relative z-10 max-md:hidden">
          {texts.map((text, i) => (
            <motion.div
              key={i}
              style={anims[i]}
              className="min-h-[200px] h-auto w-full max-w-[600px] text-center flex items-center justify-center"
            >
              <p className="text-2xl font-light text-gray-200">{text}</p>
            </motion.div>
          ))}
        </div>

        {/* Right: Swiper Text (ONLY shown on Mobile) */}
        <div className="md:hidden block w-full px-6 relative z-10 pb-12 mt-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/10">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              spaceBetween={20}
              slidesPerView={1}
              className="w-full pb-10"
            >
              {texts.map((text, i) => (
                <SwiperSlide key={i} className="flex flex-col items-center justify-center min-h-[160px]">
                  <p className="text-lg font-medium text-center text-gray-200 px-2">
                    {text}
                  </p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
