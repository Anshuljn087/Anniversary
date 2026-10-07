"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import CandleBlow from "./CandleBlow";
import WaxSeal from "./WaxSeal";

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

export default function Finale() {
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
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden glass-panel flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.16),_transparent_65%)]" />

      <AnimatePresence mode="wait">
        {stage === "candles" && (
          <motion.div
            key="candles"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full"
          >
            <CandleBlow onBlownOut={handleBlownOut} />
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
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.3),_transparent_70%)]"
            />
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
    </div>
  );
}
