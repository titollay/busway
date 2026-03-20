import { useEffect, useRef } from "react";

export default function SequenceBackground({ progress }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef(0);
  const lastProgressRef = useRef(0);

  const frameCount = 30;

  const drawFrame = (frame) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = imagesRef.current[frame];

    if (!canvas || !ctx || !img || !img.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  // تحميل الصور + canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(frameRef.current);
    };

    resize();
    window.addEventListener("resize", resize);

    const images = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = `/bg-1/${String(i + 1).padStart(4, "0")}.jpg`;
      images.push(img);
    }
    imagesRef.current = images;

    images[0].onload = () => drawFrame(0);

    return () => window.removeEventListener("resize", resize);
  }, []);

  // 🎯 Loop + Reverse
  useEffect(() => {
    if (!progress) return;

    const unsubscribe = progress.on("change", (v) => {
      const lastV = lastProgressRef.current;

      // تحديد الاتجاه
      const direction = v > lastV ? 1 : -1;

      // تحريك frame
      let nextFrame = frameRef.current + direction;

      // 🔁 Loop ذكي
      if (nextFrame >= frameCount) nextFrame = frameCount - 1;
      if (nextFrame < 0) nextFrame = 0;

      frameRef.current = nextFrame;
      lastProgressRef.current = v;

      requestAnimationFrame(() => drawFrame(nextFrame));
    });

    return unsubscribe;
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute bg-cover inset-0 h-full w-full  pointer-events-none"
    />
  );
}
