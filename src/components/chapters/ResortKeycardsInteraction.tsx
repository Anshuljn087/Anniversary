"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import type { ChapterImage } from "@/data/journey";
import PhotoFrame from "../PhotoFrame";
import { getDynamicAudioEngine } from "@/lib/dynamicAudio";

function Keycard({ image }: { image: ChapterImage }) {
  const [unlocked, setUnlocked] = useState(false);
  const [swiping, setSwiping] = useState(false);

  const handleTap = () => {
    if (swiping) return;
    setSwiping(true);
    getDynamicAudioEngine()?.playOneShot("beep");
    setTimeout(() => {
      setUnlocked(true);
      setSwiping(false);
    }, 450);
  };

  return (
    <button
      onClick={handleTap}
      disabled={unlocked}
      className="relative w-full h-full rounded-xl overflow-hidden cursor-pointer disabled:cursor-default"
      aria-label={`Unlock ${image.caption}`}
    >
      {!unlocked ? (
        <motion.div
          animate={swiping ? { x: [0, 10, -4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-gradient-to-br from-[#3a3f4a] via-[#20242c] to-[#0e1015] flex flex-col items-center justify-center gap-3 border border-champagne/20"
        >
          <motion.div
            animate={swiping ? { opacity: [0, 0.9, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
          <div className="w-10 h-7 rounded-sm bg-gradient-to-br from-champagne-soft to-champagne/60 shadow-inner" />
          <KeyRound size={18} className="text-champagne/70" strokeWidth={1.5} />
          <span className="text-ivory/80 text-xs sm:text-sm font-light tracking-wide text-center px-3">
            {image.caption}
          </span>
          <span className="text-ivory/40 text-[10px] uppercase tracking-[0.2em]">
            Tap to unlock
          </span>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <PhotoFrame src={image.src} alt={image.alt} className="absolute inset-0 w-full h-full pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
          <span className="absolute bottom-2 left-0 right-0 text-center text-ivory text-xs sm:text-sm font-light tracking-wide">
            {image.caption}
          </span>
        </motion.div>
      )}
    </button>
  );
}

export default function ResortKeycardsInteraction({ images }: { images: ChapterImage[] }) {
  return (
    <div className="relative w-full h-full grid grid-cols-1 sm:grid-cols-3 gap-2 p-2">
      {images.map((img) => (
        <Keycard key={img.caption} image={img} />
      ))}
    </div>
  );
}
