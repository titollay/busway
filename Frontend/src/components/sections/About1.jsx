import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

import bus  from "../../assets/bus.jpg";
import bus2 from "../../assets/bus2.jpg";
import wall from "../../assets/wall.webp";

// ─── Data ─────────────────────────────────────────────────────────────────────

const images = [bus, bus2, wall, bus2];

const texts = [
  {
    num: "01",
    title: "Vision & Innovation",
    body: "BusWay est une plateforme dédiée au suivi des bus en temps réel à Oujda — conçue pour aider chaque usager à mieux organiser ses déplacements au quotidien.",
  },
  {
    num: "02",
    title: "Précision GPS",
    body: "Grâce à une carte interactive et à l'intégration GPS, vous connaissez à tout moment la position exacte de votre bus et son temps d'arrivée estimé.",
  },
  {
    num: "03",
    title: "Impact Urbain",
    body: "Un réseau de 50 lignes, 120 bus connectés et 10 000 voyageurs heureux chaque jour. BusWay, c'est la mobilité urbaine simple et prévisible.",
  },
];

// ─── Shared Components ────────────────────────────────────────────────────────

function RoundImg({ src, alt, rotate }) {
  return (
    <motion.div 
      style={{ rotate }}
      className="h-64 w-44 overflow-hidden rounded-[4rem] shadow-[-20px_20px_60px_rgba(0,0,0,0.4)] border border-white/5 group"
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
        style={{ filter: "brightness(0.7) contrast(1.1)" }}
      />
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function About() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end start"],
  });

  /* Parallax offsets */
  const leftY   = useTransform(scrollYProgress, [0, 1], ["-100px", "100px"]);
  const rightY  = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"]);
  
  /* Rotation for a more "organic/rounded" feel */
  const rotateL = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  const rotateR = useTransform(scrollYProgress, [0, 1], [5, -5]);

  /* Text block animations */
  const makeAnim = (range) => ({
    y:       useTransform(scrollYProgress, range, ["350px", "0px"]),
    opacity: useTransform(scrollYProgress, range, [0, 1]),
    scale:   useTransform(scrollYProgress, range, [0.92, 1]),
  });

  const anims = [
    makeAnim([0,    0.33]),
    makeAnim([0.3,  0.63]),
    makeAnim([0.58, 0.82]),
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="bg-[#070320] text-white relative"
      style={{ minHeight: "100vh" }}
    >
      {/* Background soft circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div
        className="min-h-[140vh] max-md:min-h-screen relative flex items-start
                   justify-between max-md:flex-col
                   max-w-7xl mx-auto px-6 lg:px-16"
      >

        {/* ── LEFT: Sticky Panel with "Rounded" Imagery ── */}
        <div
          className="sticky top-0 h-screen w-full lg:w-1/2 flex flex-col justify-center
                     max-md:relative max-md:h-auto max-md:py-16"
        >
          {/* Section label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-blue-500/50" />
            <p className="text-[0.7rem] uppercase tracking-[0.4em] text-blue-400 font-semibold">
              Discovery
            </p>
          </div>

          {/* Heading */}
          <h2
            className="text-5xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight mb-12"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            L'Essence<br />
            <span className="text-blue-500 italic">BusWay</span>
          </h2>

          {/* Overlapping Rounded Image Columns */}
          <div className="relative w-full mt-24 lg:mt-32 pb-20">
            <div className="flex items-start justify-start gap-8 lg:gap-12">
              <motion.div style={{ y: leftY }} className="flex flex-col gap-8">
                <RoundImg src={images[0]} alt="Bus" rotate={rotateL} />
                <RoundImg src={images[1]} alt="Comfort" rotate={rotateL} />
              </motion.div>
              <motion.div style={{ y: rightY }} className="flex flex-col gap-8 mt-24 lg:mt-32">
                <RoundImg src={images[2]} alt="Oujda" rotate={rotateR} />
                <RoundImg src={images[3]} alt="Route" rotate={rotateR} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Scrolling Text Blocks ── */}
        <div
          className="w-full lg:w-1/2 flex flex-col gap-[30vh] lg:pl-16 py-[25vh] max-md:hidden"
        >
          {texts.map((t, i) => (
            <motion.div
              key={i}
              style={anims[i]}
              className="group flex flex-col gap-6"
            >
              {/* Number Index */}
              <div className="flex items-end gap-4">
                  <span className="text-6xl font-bold opacity-10 font-serif leading-none">
                      {t.num}
                  </span>
                  <div className="h-px bg-blue-500/30 w-full mb-2" />
              </div>

              {/* Title */}
              <h4 className="text-blue-400 text-sm uppercase tracking-widest font-bold">
                {t.title}
              </h4>

              {/* Body */}
              <p
                className="text-2xl lg:text-3xl font-light text-gray-100 leading-snug lg:max-w-md"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── MOBILE: Content Slider ── */}
        <div className="lg:hidden w-full pb-20">
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
              spaceBetween={30}
              slidesPerView={1}
            >
              {texts.map((t, i) => (
                <SwiperSlide key={i} className="flex flex-col gap-4 pb-12">
                  <h4 className="text-blue-500 text-xs uppercase tracking-widest font-bold">{t.title}</h4>
                  <p className="text-xl text-gray-200 font-light leading-relaxed font-serif">
                    {t.body}
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
