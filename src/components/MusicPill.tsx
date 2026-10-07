"use client";

import { useState } from "react";
import { Music, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { getPianoEngine } from "@/lib/audio";

export default function MusicPill() {
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    const engine = getPianoEngine();
    if (!engine) return;
    if (playing) {
      engine.pause();
      setPlaying(false);
    } else {
      await engine.play();
      setPlaying(true);
    }
  };

  return (
    <motion.button
      onClick={toggle}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="glass-panel fixed top-5 right-5 z-50 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-ivory/90 cursor-pointer select-none"
      aria-label={playing ? "Pause music" : "Play music"}
    >
      <span className="relative flex h-2 w-2">
        {playing && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-champagne opacity-75 animate-ping" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            playing ? "bg-champagne" : "bg-ivory/40"
          }`}
        />
      </span>
      {playing ? <Pause size={14} strokeWidth={1.75} /> : <Music size={14} strokeWidth={1.75} />}
      <span className="hidden sm:inline font-light tracking-wide">
        {playing ? "Our Song" : "Play Our Song"}
      </span>
    </motion.button>
  );
}
