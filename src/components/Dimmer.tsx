"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import PhotoFrame from "./PhotoFrame";
import type { ChapterImage } from "@/data/journey";

export default function Dimmer({ image }: { image: ChapterImage }) {
  const [level, setLevel] = useState(0.15); // 0 = dark/candlelit, 1 = bright
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientY = (clientY: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = 1 - (clientY - rect.top) / rect.height;
    setLevel(Math.min(1, Math.max(0, ratio)));
  };

  const brightness = 0.35 + level * 0.65;
  const warmth = 1 - level;

  return (
    <div className="relative w-full h-full flex">
      <div className="relative flex-1 overflow-hidden">
        <PhotoFrame
          src={image.src}
          alt={image.alt}
          className="absolute inset-0 w-full h-full transition-[filter] duration-150 pointer-events-none"
          style={{ filter: `brightness(${brightness}) saturate(${1 + warmth * 0.3})` }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-150 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 70%, rgba(212,175,55,0.45), transparent 60%)",
            opacity: warmth,
          }}
        />
        <div
          className="absolute inset-0 bg-black transition-opacity duration-150 pointer-events-none"
          style={{ opacity: (1 - level) * 0.45 }}
        />

        <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
          <p className="font-display italic text-ivory text-lg sm:text-xl leading-snug drop-shadow">
            &ldquo;In the dimmest light, I saw my brightest future.&rdquo;
          </p>
        </div>
      </div>

      {/* Apple Control-Center style vertical slider */}
      <div className="w-16 sm:w-20 flex items-center justify-center py-8 shrink-0">
        <div
          ref={trackRef}
          onPointerDown={(e) => {
            dragging.current = true;
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            setFromClientY(e.clientY);
          }}
          onPointerMove={(e) => {
            if (dragging.current) setFromClientY(e.clientY);
          }}
          onPointerUp={() => (dragging.current = false)}
          className="relative h-full w-10 rounded-full bg-black/40 border border-champagne/20 cursor-pointer touch-none"
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-full bg-gradient-to-t from-champagne to-champagne-soft"
            style={{ height: `${level * 100}%` }}
          />
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-9 h-9 rounded-full glass-panel flex items-center justify-center text-[10px] text-ivory/80"
            style={{ bottom: `calc(${level * 100}% - 18px)` }}
          >
            ☀
          </motion.div>
        </div>
      </div>
    </div>
  );
}
