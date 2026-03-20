import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./hero.css"; // We'll create this for the mask styles

export default function HoverMaskReveal() {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const maskSize = isHovered ? 300 : 0;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-screen overflow-hidden bg-[#07041B] flex items-center justify-center cursor-none"
    >
      {/* Background Layer (Dull/Base) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 select-none">
        <h1 className="text-6xl md:text-8xl font-bold text-white/10 tracking-tighter">
          BUSWAY TRANSIT
        </h1>
        <p className="text-xl md:text-2xl text-white/5 mt-4 max-w-2xl">
          Tracking the future of urban mobility. Hover to reveal the path.
        </p>
      </div>

      {/* Reveal Layer (Bright/Active) */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 bg-blue-600 pointer-events-none select-none"
        style={{
          WebkitMaskImage: `radial-gradient(circle ${maskSize}px at var(--x) var(--y), black 100%, transparent 100%)`,
          maskImage: `radial-gradient(circle ${maskSize}px at var(--x) var(--y), black 100%, transparent 100%)`,
          "--x": cursorX,
          "--y": cursorY,
        }}
      >
        <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter">
          BUSWAY TRANSIT
        </h1>
        <p className="text-xl md:text-2xl text-white mt-4 max-w-2xl">
          Real-time tracking, optimized routes, and seamless travel for everyone.
        </p>
        <div className="mt-8 px-8 py-3 bg-white text-blue-600 font-bold rounded-full text-lg shadow-2xl">
          Explore Now
        </div>
      </motion.div>

      {/* Custom Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full z-50 pointer-events-none mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovered ? 2.5 : 1,
        }}
      />
    </div>
  );
}
