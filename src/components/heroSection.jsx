import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
 import heroimg from "../assets/hero4.png";

import img1 from "../assets/team/1.webp";
import img12 from "../assets/team/12.webp";
import img13 from "../assets/team/13.webp";
import img14 from "../assets/team/14.webp";
import img15 from "../assets/team/15.webp";
import img16 from "../assets/team/16.webp";
import img18 from "../assets/team/18.webp";
import img19 from "../assets/team/19.webp";

// import bg2 from "../assets/bg/Rectangle 4.png";
import Button from "../commont/btnScroll";

const teamImages = [img1, img12, img13, img14, img15, img16, img19, img18];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.18 },
  },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const [count, setCount] = useState(0);
  const sectionRef = useRef(null);
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!startCount) return;
    const target = 120000;
    const duration = 2000;
    const stepTime = 20;
    const increment = Math.ceil(target / (duration / stepTime));
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev + increment >= target) {
          clearInterval(interval);
          return target;
        }
        return prev + increment;
      });
    }, stepTime);
    return () => clearInterval(interval);
  }, [startCount]);
  return (
    <>
      <style>{`
        .hero-root {
          font-family: 'DM Sans', sans-serif;
        }

        /* Shop Now — filled blue */
        .hero-btn-primary {
          position: relative;
          overflow: hidden;
          display: inline-block;
          padding: 13px 36px;
          background: #2563EB;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.35s ease;
          white-space: nowrap;
        }

        .hero-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #1D4ED8;
          transform: translateX(-101%);
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }

        .hero-btn-primary:hover::before { transform: translateX(0); }
        .hero-btn-primary span { position: relative; z-index: 1; }

        /* Browse — outline white */
        .hero-btn-secondary {
          position: relative;
          overflow: hidden;
          display: inline-block;
          padding: 13px 36px;
          background: transparent;
          color: rgba(255,255,255,0.85);
          border: 1px solid rgba(255,255,255,0.3);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          transition: color 0.35s ease;
          white-space: nowrap;
          backdrop-filter: blur(6px);
        }

        .hero-btn-secondary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.08);
          transform: translateX(-101%);
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }

        .hero-btn-secondary:hover::before { transform: translateX(0); }
        .hero-btn-secondary:hover { color: #fff; border-color: rgba(255,255,255,0.6); }
        .hero-btn-secondary span { position: relative; z-index: 1; }

        /* Counter */
        .hero-counter-val {
          font-family: 'Cormorant Garamond', serif;
         
          color: #3B82F6;
          line-height: 1;
        }

        .hero-counter-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-top: 3px;
        }

        /* Team avatars */
        .hero-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(59,130,246,0.5);
          margin-left: -10px;
          flex-shrink: 0;
        }

        .hero-avatar:first-child { margin-left: 0; }

        /* Divider line */
        .hero-divider {
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.12);
          flex-shrink: 0;
        }

        /* Image glow */
        .hero-img-wrap::after {
          content: '';
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 80px;
          background: radial-gradient(ellipse, rgba(59,130,246,0.25) 0%, transparent 70%);
          pointer-events: none;
          filter: blur(20px);
        }
      `}</style>
      <section
        ref={sectionRef}
        className="hero-root   flex flex-col justify-center relative font-poppins  z-0 px-8  xl:py-32   lg:py-28 lg:px-10 hero-root  sm:px-8 xl:px-14 py-10 sm:py-10   "
      >
        {/* Decorative Background Images */}
        <img
          className="absolute w-1/6 z-0 opacity-30 pointer-events-none left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 "
          // src={bg2}
          alt=""
        />

        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-2 items-center m-auto max-w-7xl px-8 xl:py-12 py-12  gap-20 ">
          {/* Left Content */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="xl:space-y-4 lg:space-y-2 space-y-2 mt-2 text-center lg:text-left"
          >
            <motion.h1
              variants={item}
              className="display text-white text-4xl sm:text-5xl xl:text-6xl font-light leading-[1.08]  text-shadow-lg  lg:text-4xl  "
            >
              <span className="text-[#3B82F6]  not-italic ">
                Simplifiez vos trajets,&nbsp;
              </span>
                suivez votre bus en temps réel.
            </motion.h1>

            <motion.p
              variants={item}
              className="xl:text-lg lg:text-sm font-medium text-gray-300 text-shadow-2xs"
            >
              Ne manquez plus jamais votre bus. Busway vous permet de localiser
              vos autobus en direct et de consulter les horaires de passage à
              chaque arrêt.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={item}
              className="mt-8 mb-12 flex flex-col sm:flex-row sm:justify-center lg:justify-start  gap-4"
            >
              <a
                href="#"
                className="text-center px-6 py-2.5  text-lg xl:text-xl lg:text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                id="heroBookBtn"
              >
                Trouver mon bus
              </a>

              <a
                href="#services"
                className="text-center px-6 py-2.5 text-lg lg:text-xl font-semibold
 text-white text-shadow-xs border border-white/40 backdrop-blur-md
  rounded-lg hover:bg-white hover:text-[#3B82F6] transition-all"
              >
                Réseau & Horaires →
              </a>
            </motion.div>

            {/* Team & Counter */}
            <motion.div
              variants={item}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-6 sm:gap-x-6 xl:pt-4 lg:pt-2 pt-0"
            >
              {/* Avatars */}
              <div className="flex items-center -space-x-4">
                {teamImages.slice(0, 5).map((img, i) => (
                  <motion.img
                    key={i}
                    src={img}
                    alt=""
                    className="hero-avatar w-10 h-10 sm:w-12 sm:h-12 border-2 border-[#07041B] rounded-full object-cover  hover:grayscale-0 transition-all duration-300"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: i * 0.08,
                      type: "spring",
                      stiffness: 200,
                    }}
                    viewport={{ once: true }}
                  />
                ))}
              </div>

              <div className="hero-divider hidden md:block w-px h-8 bg-white/10" />

              {/* Counter 1 */}
              <div className="text-left">
                <div className="flex items-center text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold gap-1 hero-counter-val">
                  {count.toLocaleString()}
                  <span className="text-blue-400 text-lg sm:text-2xl">+</span>
                </div>
                <div className="hero-counter-label text-[10px] sm:text-[12px]">Passagers satisfaits</div>
              </div>

              <div className="hero-divider hidden lg:block w-px h-8 bg-white/10" />

              {/* Counter 2 */}
              <div className="text-left">
                <div className="flex items-center gap-1 text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold hero-counter-val text-white">
                  4.9
                  <span className="text-blue-400 text-lg sm:text-2xl">★</span>
                </div>
                <div className="hero-counter-label text-[10px] sm:text-[12px]">Note moyenne</div>
              </div>
            </motion.div>
          </motion.div>
          {/* ── RIGHT — Image ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="hero-img-wrap relative flex justify-center items-center"
          >
            {/* Background glow ring */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 65%)",
              }}
            />

            <img
              src={heroimg}
              alt="Hero"
              className="relative w-full max-w-xs sm:max-w-sm lg:max-w-full h-auto object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>
        <div className="flex justify-center items-center ">
          <Button />
        </div>
      </section>
    </>
  );
}
