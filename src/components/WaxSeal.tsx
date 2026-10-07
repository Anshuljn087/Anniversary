"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loveLetter } from "@/data/journey";

export default function WaxSeal({ onBreak }: { onBreak: () => void }) {
  const [broken, setBroken] = useState(false);
  const [open, setOpen] = useState(false);

  const handleBreak = () => {
    if (broken) return;
    setBroken(true);
    onBreak();
    setTimeout(() => setOpen(true), 700);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="relative w-[85%] sm:w-[420px] aspect-[3/2]"
          >
            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[#f1e9d8] via-[#e9dfc8] to-[#d8cba8] shadow-2xl">
              <div className="absolute inset-0 opacity-30 [clip-path:polygon(0_0,50%_45%,100%_0,100%_100%,0_100%)] bg-black/10" />
            </div>

            <button
              onClick={handleBreak}
              aria-label="Break the wax seal"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            >
              <motion.div
                animate={broken ? { scale: [1, 1.3, 0], rotate: 25, opacity: [1, 1, 0] } : {}}
                transition={{ duration: 0.6, ease: "easeIn" }}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#8a1f1f] via-[#6e1414] to-[#4d0d0d] shadow-lg flex items-center justify-center border border-[#c9433355]"
              >
                <span className="font-display text-ivory text-xs sm:text-sm tracking-wider text-center leading-tight">
                  2<br />Years
                </span>
                {!broken && (
                  <span className="absolute inset-0 rounded-full border-2 border-champagne-soft/20 animate-pulse-slow" />
                )}
              </motion.div>
            </button>

            {!broken && (
              <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-ivory/50 text-xs uppercase tracking-[0.25em] font-light whitespace-nowrap">
                Tap the seal to open
              </span>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel relative w-full sm:w-[460px] max-h-[70vh] overflow-y-auto no-scrollbar rounded-lg p-8 sm:p-10"
          >
            <p className="font-display text-ivory text-lg sm:text-xl leading-relaxed whitespace-pre-line italic">
              {loveLetter}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
