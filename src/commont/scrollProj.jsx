import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ProjectsScrollText({ text = "PROJECTS" }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // تحريك أفقي حسب السكرول
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-white py-24">
      {/* نص حقيقي للـ SEO */}
      <h2 className="sr-only">{text}</h2>

      <div className="whitespace-nowrap overflow-hidden">
        <motion.div
          style={{ x }}
          className="flex gap-16 font-extrabold uppercase text-black"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="text-[6rem] sm:text-[8rem] lg:text-[10rem]"
            >
              {text} •
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
