"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import type { Chapter as ChapterType } from "@/data/journey";
import CandleCake from "./CandleCake";
import PhotoFrame from "./PhotoFrame";

export default function BirthdayChapter({ chapter }: { chapter: ChapterType }) {
  const [revealed, setRevealed] = useState(false);
  const image = chapter.media.images[0];

  const handleBlownOut = useCallback(() => {
    setRevealed(true);
    confetti({
      particleCount: 60,
      spread: 85,
      startVelocity: 35,
      origin: { x: 0.5, y: 0.55 },
      colors: ["#D4AF37", "#F1D98B", "#FFFFFF"],
      scalar: 0.85,
      gravity: 0.9,
      ticks: 200,
    });
  }, []);

  return (
    <section
      id={chapter.id}
      data-audio-zone={chapter.audioZone}
      className="relative w-full pt-28 pb-20 md:pt-32 md:pb-28"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian-0 via-obsidian-1 to-obsidian-0 pointer-events-none" />
      <div className="grain absolute inset-0 opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 flex flex-col items-center text-center gap-10">
        {/* Top: date & story card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="glass-panel rounded-2xl px-6 py-6 sm:px-8 sm:py-8 w-full"
        >
          <p className="text-champagne/80 text-xs sm:text-sm uppercase tracking-[0.3em] font-light mb-3">
            {chapter.kicker}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl leading-[1.05] text-ivory mb-2">
            {chapter.title}
          </h2>
          <p className="text-champagne-soft/70 text-sm sm:text-base font-light italic mb-5">
            {chapter.dateLabel}
          </p>
          {chapter.body.map((p, i) => (
            <p
              key={i}
              className="text-ivory-dim text-base leading-relaxed font-light"
            >
              {p}
            </p>
          ))}
        </motion.div>

        {/* Center: candle cake interaction */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative w-full h-[50vh] min-h-[360px] rounded-2xl overflow-hidden glass-panel"
        >
          {!revealed ? (
            <CandleCake
              candleCount={2}
              prompt="Happy Birthday — make a wish."
              onBlownOut={handleBlownOut}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-full"
            >
              <PhotoFrame
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-0 right-0 text-center pointer-events-none px-4">
                <span className="font-display italic text-ivory text-lg drop-shadow">
                  Wish made. Here&rsquo;s to another year of you.
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
