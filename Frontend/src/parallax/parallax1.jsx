import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";


export default function Parallax1({ sectionName }) {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSmallScreen = width < 640;

  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end start"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const animatedLetterSpacing = useTransform(
    scrollYProgress,
    [0, 0.8],
    ["128px", "0px"]
  );
  const animatedTextScale = useTransform(scrollYProgress, [0, 0.7], [0.2, 1.3]);
  const modelOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [0, 1, 1, 0]
  );
  const textLetterSpacing = isSmallScreen ? "0px" : animatedLetterSpacing;
  const textScale = !isSmallScreen ? 1 : animatedTextScale;
  const textFill = useTransform(
    scrollYProgress,
    [0.7, 0.9],
    ["100% 0%", "0% 0%"]
  );

  return (
    <div className="min-h-[100vh] bg-[#070320] flex items-center justify-center relative py-[3rem] pb-[5rem]">
      <motion.div
        style={{ opacity: modelOpacity }}
        className="pointer-events-none"
      >
    
      </motion.div>
      <motion.div
        ref={ref}
        className="flex h-[250vh] font-[600] items-center justify-center"
      >
        <motion.h1
          style={{
            opacity: textOpacity,
            letterSpacing: textLetterSpacing,
            scale: textScale,
            backgroundPosition: textFill,
          }}
          className="fillText sticky top-[40%]  text-[6rem] whitespace-nowrap text-center max-sm:text-[3rem] font-[800]"
        >
          {sectionName}
        </motion.h1>
      </motion.div>
    </div>
  );
}
