"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhotoFrame from "./PhotoFrame";
import type { ChapterImage } from "@/data/journey";

export default function Headlights({ image }: { image: ChapterImage }) {
  const [on, setOn] = useState(false);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden glass-panel">
      <PhotoFrame src={image.src} alt={image.alt} className="w-full h-full brightness-[0.35]" />

      {/* dark highway overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/60" />

      {/* headlight glow cones */}
      <AnimatePresence>
        {on && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <div
              className="absolute left-1/2 top-[55%] -translate-x-1/2 w-[140%] h-[70%]"
              style={{
                background:
                  "conic-gradient(from 270deg at 50% 0%, transparent 0deg, rgba(255,247,214,0.35) 18deg, rgba(255,247,214,0.5) 30deg, transparent 55deg, transparent 305deg, rgba(255,247,214,0.5) 330deg, rgba(255,247,214,0.35) 342deg, transparent 360deg)",
                filter: "blur(4px)",
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_90%,_rgba(255,244,214,0.3),_transparent_60%)]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-ivory/70 text-xs uppercase tracking-[0.25em] font-light">
          {on ? "High beams on" : "Dark highway, no lights"}
        </span>
        <button
          onClick={() => setOn((v) => !v)}
          className={`glass-panel relative w-20 h-10 rounded-full flex items-center px-1 transition-colors cursor-pointer ${
            on ? "bg-champagne/20" : ""
          }`}
          aria-pressed={on}
          aria-label="Turn on high beams"
        >
          <motion.span
            animate={{ x: on ? 36 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className={`h-8 w-8 rounded-full shadow-md ${
              on ? "bg-champagne" : "bg-ivory/60"
            }`}
          />
        </button>
        <span className="text-ivory/50 text-[11px] font-light">Turn on High Beams</span>
      </div>
    </div>
  );
}
