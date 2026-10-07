"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { ChapterImage } from "@/data/journey";
import PhotoFrame from "../PhotoFrame";
import { getDynamicAudioEngine } from "@/lib/dynamicAudio";

export default function RingBoxInteraction({ image }: { image: ChapterImage }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    getDynamicAudioEngine()?.playOneShot("sparkle");
    confetti({
      particleCount: 40,
      spread: 70,
      startVelocity: 28,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#D4AF37", "#F1D98B", "#FFFFFF"],
      scalar: 0.7,
      gravity: 0.8,
      ticks: 160,
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* the real photo — fades in behind the box once it's opened */}
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <PhotoFrame src={image.src} alt={image.alt} className="absolute inset-0 w-full h-full pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/50 pointer-events-none" />
      </motion.div>

      <motion.div
        animate={{ opacity: open ? 0.5 : 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.14),_transparent_65%)] pointer-events-none"
      />

      <button
        onClick={handleOpen}
        disabled={open}
        className="relative z-10 cursor-pointer disabled:cursor-default"
        style={{ perspective: 900 }}
        aria-label="Open the ring box"
      >
        {/* box base */}
        <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-lg bg-gradient-to-b from-[#5a1f2d] via-[#3f1420] to-[#260c13] shadow-2xl border border-[#c9433355]">
          <div className="absolute inset-3 rounded-md bg-[#1b0810] flex items-center justify-center overflow-visible">
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
                  className="relative w-8 h-8 sm:w-9 sm:h-9"
                >
                  <div className="absolute inset-0 rounded-full border-[3px] border-champagne-soft shadow-[0_0_18px_rgba(212,175,55,0.6)]" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-ivory shadow-md" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* lid */}
          <motion.div
            animate={{ rotateX: open ? -125 : 0 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
            className="absolute -top-3 left-0 right-0 h-8 rounded-t-lg bg-gradient-to-b from-[#7a2838] to-[#5a1f2d] border border-[#c9433355] shadow-lg"
          >
            <div className="absolute inset-x-0 bottom-0 h-1 bg-champagne-soft/40" />
          </motion.div>
        </div>

        {!open && (
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-ivory/50 text-xs uppercase tracking-[0.25em] font-light whitespace-nowrap">
            Tap to open
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="relative z-10 font-display italic text-ivory text-lg sm:text-xl mt-10 text-center px-6 drop-shadow"
          >
            The day you said Yes 💍
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
