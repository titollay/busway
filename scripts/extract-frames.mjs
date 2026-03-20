import { execFileSync } from "child_process";
import { mkdirSync, rmSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require   = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const ffmpegPath = require("ffmpeg-static");
const INPUT  = resolve(__dirname, "../src/assets/animation.mp4");
const OUTPUT = resolve(__dirname, "../public/frames");

// Clean then recreate output directory
rmSync(OUTPUT, { recursive: true, force: true });
mkdirSync(OUTPUT, { recursive: true });

console.log("🎬 Extracting frames from animation.mp4 …");
console.log("   FFmpeg:", ffmpegPath);

execFileSync(
  ffmpegPath,
  [
    "-y",
    "-i", INPUT,
    "-vf",       "fps=30,scale=1920:-2",
    "-c:v",      "libwebp",       // force individual-frame encoder (NOT libwebp_anim)
    "-lossless", "0",
    "-q:v",      "80",
    "-an",                        // drop audio
    `${OUTPUT}/frame-%04d.webp`,
  ],
  { stdio: "inherit" }
);

const count = readdirSync(OUTPUT).filter(f => f.endsWith(".webp")).length;
console.log(`\n✅ Done! Extracted ${count} frames → public/frames/`);
console.log(`   → Use frameCount={${count}} in <CanvasScrollSequence />`);
