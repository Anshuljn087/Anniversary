"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Music, Pause } from "lucide-react";
import { getDynamicAudioEngine } from "@/lib/dynamicAudio";
import type { AudioZoneId } from "@/data/journey";
import { audioZones } from "@/data/audioConfig";

export default function DynamicAudioManager() {
  const [playing, setPlaying] = useState(false);
  const [label, setLabel] = useState("Play Our Story");

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-audio-zone]")
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const zoneId = visible.target.getAttribute("data-audio-zone") as AudioZoneId | null;
        if (!zoneId) return;
        const engine = getDynamicAudioEngine();
        engine?.setActiveZone(zoneId);
        setLabel(audioZones.find((z) => z.id === zoneId)?.label ?? "Our Song");
      },
      { threshold: [0.25, 0.5, 0.75] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const toggle = async () => {
    const engine = getDynamicAudioEngine();
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
      className="glass-panel flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-ivory/90 cursor-pointer select-none max-w-[60vw]"
      aria-label={playing ? "Pause music" : "Play music"}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {playing && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-champagne opacity-75 animate-ping" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            playing ? "bg-champagne" : "bg-ivory/40"
          }`}
        />
      </span>
      {playing ? (
        <Pause size={14} strokeWidth={1.75} className="shrink-0" />
      ) : (
        <Music size={14} strokeWidth={1.75} className="shrink-0" />
      )}
      <span className="hidden sm:inline font-light tracking-wide truncate">
        {playing ? label : "Play Our Story"}
      </span>
    </motion.button>
  );
}
