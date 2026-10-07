"use client";

import { motion } from "framer-motion";
import DynamicAudioManager from "./audio/DynamicAudioManager";

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-16 sm:h-20 backdrop-blur-xl bg-[#05070D]/90 border-b border-champagne/10 flex items-center justify-between px-5 sm:px-8"
      >
        <span className="font-display text-base sm:text-lg text-champagne/90 tracking-wide">
          Two Years of Us
        </span>
        <DynamicAudioManager />
      </motion.div>

      {/* smooth bottom mask so content fades out before it reaches the header */}
      <div className="absolute top-full left-0 right-0 h-10 bg-gradient-to-b from-[#05070D]/70 to-transparent pointer-events-none" />
    </header>
  );
}
