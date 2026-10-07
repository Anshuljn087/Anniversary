"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { Chapter as ChapterType } from "@/data/journey";
import CandleCake from "./CandleCake";
import WaxSeal from "./WaxSeal";
import { getDynamicAudioEngine } from "@/lib/dynamicAudio";

type Stage = "candles" | "wish" | "letter";

function goldBurst(originY = 0.6) {
  const colors = ["#D4AF37", "#F1D98B", "#FFFFFF"];
  confetti({
    particleCount: 90,
    spread: 100,
    startVelocity: 45,
    origin: { x: 0.5, y: originY },
    colors,
    scalar: 0.9,
    gravity: 0.9,
    ticks: 220,
  });
  const heart = confetti.shapeFromText({ text: "❤️", scalar: 2 });
  confetti({
    particleCount: 24,
    spread: 90,
    startVelocity: 32,
    origin: { x: 0.5, y: originY },
    shapes: [heart],
    scalar: 1.6,
    gravity: 0.6,
    ticks: 200,
  });
}

function fireworksLoop(durationMs: number) {
  const end = Date.now() + durationMs;
  const colors = ["#D4AF37", "#F1D98B", "#FFFFFF"];
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export default function Finale({ chapter }: { chapter: ChapterType }) {
  const [stage, setStage] = useState<Stage>("candles");
  const sealBroken = useRef(false);

  const handleBlownOut = useCallback(() => {
    setStage("wish");
    fireworksLoop(2200);
    goldBurst(0.5);
  }, []);

  const handleSealBreak = useCallback(() => {
    if (sealBroken.current) return;
    sealBroken.current = true;
    goldBurst(0.35);
    setTimeout(() => goldBurst(0.3), 250);
    // crossfade-swell into the climax zone as the letter opens
    getDynamicAudioEngine()?.setActiveZone("emotional", true);
  }, []);

  return (
    <section
      id={chapter.id}
      data-audio-zone={chapter.audioZone}
      className="relative w-full py-20 md:py-28"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian-0 via-obsidian-1 to-obsidian-0 pointer-events-none" />
      <div className="grain absolute inset-0 opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.1),_transparent_65%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 flex flex-col items-center text-center gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="glass-panel rounded-2xl px-6 py-6 sm:px-8 sm:py-8 w-full"
        >
          <p className="text-champagne/80 text-xs sm:text-sm uppercase tracking-[0.3em] font-light mb-3">
            {chapter.kicker}
          </p>
          <h2 className="font-display text-gradient-gold text-4xl sm:text-5xl leading-[1.05] mb-2">
            {chapter.title}
          </h2>
          <p className="text-champagne-soft/70 text-sm sm:text-base font-light italic mb-5">
            {chapter.dateLabel}
          </p>
          {chapter.body.map((p, i) => (
            <p key={i} className="text-ivory-dim text-base leading-relaxed font-light">
              {p}
            </p>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative w-full h-[58vh] min-h-[420px] rounded-2xl overflow-hidden glass-panel flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            {stage === "candles" && (
              <motion.div
                key="candles"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full"
              >
                <CandleCake
                  candleCount={2}
                  labels={["Year One", "Year Two"]}
                  prompt="Make a wish, together."
                  onBlownOut={handleBlownOut}
                />
              </motion.div>
            )}

            {stage === "wish" && (
              <motion.div
                key="wish"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative flex flex-col items-center text-center px-6"
              >
                <h3 className="font-display text-gradient-gold text-3xl sm:text-4xl md:text-5xl leading-tight mb-4">
                  Happy 2nd Anniversary,
                  <br />
                  My Love! 🥂
                </h3>
                <p className="text-ivory-dim text-base sm:text-lg font-light italic mb-10">
                  To a lifetime of forever.
                </p>
                <button
                  onClick={() => setStage("letter")}
                  className="glass-panel rounded-full px-7 py-3.5 text-sm sm:text-base text-ivory/90 font-light tracking-wide cursor-pointer"
                >
                  One more thing for you →
                </button>
              </motion.div>
            )}

            {stage === "letter" && (
              <motion.div
                key="letter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full"
              >
                <WaxSeal onBreak={handleSealBreak} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
