"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChapterImage } from "@/data/journey";
import PhotoFrame from "../PhotoFrame";
import { getDynamicAudioEngine } from "@/lib/dynamicAudio";

const BULBS = Array.from({ length: 10 }, (_, i) => ({
  x: 8 + i * 9.5,
  y: 8 + Math.sin(i * 0.9) * 10,
  delay: i * 0.18,
}));

export default function FairyLightsInteraction({ image }: { image: ChapterImage }) {
  const [lit, setLit] = useState(false);
  const pulled = useRef(false);

  const handlePull = () => {
    if (pulled.current) return;
    pulled.current = true;
    setLit(true);
    getDynamicAudioEngine()?.playOneShot("cord");
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <PhotoFrame
        src={image.src}
        alt={image.alt}
        className="absolute inset-0 w-full h-full pointer-events-none transition-[filter] duration-700"
        style={{ filter: lit ? "brightness(1)" : "brightness(0.55)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{ opacity: lit ? 0 : 0.5 }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* fairy light string */}
      <svg
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        className="absolute top-0 left-0 w-full h-16 pointer-events-none"
      >
        <path
          d="M0,4 Q25,16 50,4 T100,4"
          fill="none"
          stroke="rgba(212,175,55,0.35)"
          strokeWidth="0.4"
        />
      </svg>
      {BULBS.map((b, i) => (
        <motion.span
          key={i}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            background: lit ? "#f1d98b" : "#55504a",
            boxShadow: lit ? "0 0 8px 3px rgba(241,217,139,0.7)" : "none",
          }}
          animate={lit ? { opacity: [0.6, 1, 0.75, 1], scale: [1, 1.15, 1] } : { opacity: 1 }}
          transition={{
            duration: 1.8,
            repeat: lit ? Infinity : 0,
            delay: b.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* pull cord */}
      <div className="absolute top-0 right-[18%] sm:right-[22%] flex flex-col items-center z-20">
        <div className="w-px h-10 bg-ivory/40" />
        <motion.button
          onClick={handlePull}
          drag={lit ? false : "y"}
          dragConstraints={{ top: 0, bottom: 28 }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.y > 14) handlePull();
          }}
          whileTap={{ scale: 0.95 }}
          aria-label="Pull to turn on fairy lights"
          className="w-5 h-7 rounded-full bg-gradient-to-b from-ivory to-champagne-soft shadow-md cursor-grab active:cursor-grabbing touch-none"
        />
        {!lit && (
          <span className="mt-2 text-ivory/60 text-[10px] uppercase tracking-[0.2em] font-light text-center whitespace-nowrap">
            Pull to turn on
            <br />
            fairy lights
          </span>
        )}
      </div>

      {/* photobooth strip */}
      <AnimatePresence>
        {lit && (
          <motion.div
            initial={{ y: "-110%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 left-5 sm:left-8 w-16 sm:w-20 bg-ivory p-1.5 shadow-2xl z-10"
          >
            <div className="relative w-full aspect-square overflow-hidden mb-1.5">
              <PhotoFrame src={image.src} alt={image.alt} className="absolute inset-0 w-full h-full" />
            </div>
            <div className="relative w-full aspect-square overflow-hidden mb-1.5 grayscale">
              <PhotoFrame src={image.src} alt={image.alt} className="absolute inset-0 w-full h-full" />
            </div>
            <div className="relative w-full aspect-square overflow-hidden sepia">
              <PhotoFrame src={image.src} alt={image.alt} className="absolute inset-0 w-full h-full" />
            </div>
            <p className="text-obsidian-0/50 text-[8px] text-center mt-1.5 uppercase tracking-wider">
              Us, lately
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
