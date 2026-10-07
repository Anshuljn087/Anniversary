"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDynamicAudioEngine } from "@/lib/dynamicAudio";

export default function CafeNapkinInteraction() {
  const [unfolded, setUnfolded] = useState(false);

  const handleTap = () => {
    if (unfolded) return;
    setUnfolded(true);
    getDynamicAudioEngine()?.playOneShot("chime");
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,_rgba(212,175,55,0.12),_transparent_60%)] pointer-events-none" />

      {/* coffee cup with steam */}
      <div className="absolute top-[14%] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
        <div className="relative flex gap-2 mb-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-1 h-7 rounded-full bg-ivory/30 blur-[2px]"
              animate={{ y: [0, -14, -22], opacity: [0, 0.6, 0], scaleX: [1, 1.6, 2] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
        <div className="relative w-16 h-12 sm:w-20 sm:h-14">
          <div className="absolute inset-0 rounded-b-2xl rounded-t-sm bg-gradient-to-b from-ivory to-champagne-soft/80 shadow-lg" />
          <div className="absolute -right-3 top-2 w-5 h-5 border-[3px] border-ivory rounded-full bg-transparent" />
          <div className="absolute inset-x-1 top-0 h-2 rounded-full bg-[#3b2415]" />
        </div>
        <div className="w-24 h-2 rounded-full bg-black/30 blur-sm mt-1" />
      </div>

      {/* napkin */}
      <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2">
        <AnimatePresence mode="wait">
          {!unfolded ? (
            <motion.button
              key="folded"
              onClick={handleTap}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-20 h-20 sm:w-24 sm:h-24 cursor-pointer"
              aria-label="Unfold the napkin"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-ivory via-ivory/95 to-champagne-soft/70 rounded-sm shadow-xl" />
              <div className="absolute inset-0 [clip-path:polygon(0_0,100%_0,0_100%)] bg-black/10 rounded-sm" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-obsidian-0/40 text-[10px] uppercase tracking-[0.2em] font-light">
                  Tap
                </span>
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="unfolded"
              initial={{ scale: 0.3, rotateX: -80, opacity: 0.6 }}
              animate={{ scale: 1, rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 800 }}
              className="relative w-[240px] sm:w-[280px] px-6 py-5 bg-gradient-to-br from-ivory via-ivory/95 to-champagne-soft/60 rounded-sm shadow-2xl"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="font-display italic text-obsidian-0/80 text-base sm:text-lg text-center leading-snug"
              >
                The day we first met over coffee&hellip; ☕
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!unfolded && (
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ivory/50 text-xs uppercase tracking-[0.25em] font-light pointer-events-none">
          Tap the napkin
        </span>
      )}
    </div>
  );
}
