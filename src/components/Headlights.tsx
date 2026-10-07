"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio } from "lucide-react";
import PhotoFrame from "./PhotoFrame";
import type { ChapterImage } from "@/data/journey";
import { getDynamicAudioEngine } from "@/lib/dynamicAudio";

const STATIONS = ["88.5 · Lo-Fi Nights", "91.2 · Drive Beats", "97.6 · Our Playlist"];

function RadioDial() {
  const [station, setStation] = useState(0);
  const dragStart = useRef(0);
  const lastStation = useRef(0);

  const handleDrag = (_: unknown, info: { offset: { x: number } }) => {
    const delta = info.offset.x - dragStart.current;
    const steps = Math.trunc(delta / 40);
    const next = Math.min(STATIONS.length - 1, Math.max(0, lastStation.current + steps));
    if (next !== station) {
      setStation(next);
      getDynamicAudioEngine()?.playOneShot("flip");
    }
  };

  return (
    <div className="glass-panel absolute top-4 right-4 z-20 flex flex-col items-center gap-1.5 rounded-xl px-3 py-2.5 w-[150px]">
      <div className="flex items-center gap-1.5 text-ivory/60 text-[10px] uppercase tracking-[0.2em]">
        <Radio size={11} strokeWidth={1.75} />
        Tune the radio
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => {
          dragStart.current = 0;
          lastStation.current = station;
        }}
        onDrag={handleDrag}
        onDragEnd={() => (lastStation.current = station)}
        className="relative w-10 h-10 rounded-full bg-gradient-to-br from-ivory/90 to-champagne-soft/60 shadow-md cursor-grab active:cursor-grabbing touch-none"
      >
        <motion.div
          animate={{ rotate: station * 70 - 70 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="absolute inset-0 flex items-start justify-center pt-1"
        >
          <span className="w-0.5 h-3 bg-obsidian-0/70 rounded-full" />
        </motion.div>
      </motion.div>
      <span className="text-champagne-soft/80 text-[10px] font-light text-center leading-tight">
        {STATIONS[station]}
      </span>
    </div>
  );
}

export default function Headlights({ image }: { image: ChapterImage }) {
  const [on, setOn] = useState(false);

  return (
    <div className="relative w-full h-full">
      <PhotoFrame src={image.src} alt={image.alt} className="absolute inset-0 w-full h-full brightness-[0.35] pointer-events-none" />

      {/* dark highway overlay — decorative, never intercepts input */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/60 pointer-events-none" />

      {/* headlight glow cones — decorative, never intercepts input */}
      <AnimatePresence>
        {on && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none"
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

      <RadioDial />

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
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
