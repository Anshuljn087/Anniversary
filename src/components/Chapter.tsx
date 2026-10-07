"use client";

import { motion } from "framer-motion";
import type { Chapter as ChapterType } from "@/data/journey";
import PhotoFrame from "./PhotoFrame";
import Headlights from "./Headlights";
import Dimmer from "./Dimmer";
import FoggyGlass from "./FoggyGlass";
import PhotoCarousel from "./media/PhotoCarousel";
import BentoGallery from "./media/BentoGallery";

function ChapterMedia({ chapter }: { chapter: ChapterType }) {
  const { media } = chapter;

  switch (media.type) {
    case "headlights":
      return <Headlights image={media.images[0]} />;
    case "dimmer":
      return <Dimmer image={media.images[0]} />;
    case "foggyGlass":
      return <FoggyGlass image={media.images[0]} />;
    case "carousel":
      return <PhotoCarousel images={media.images} />;
    case "bento":
      return <BentoGallery images={media.images} />;
    case "single":
    default:
      return (
        <PhotoFrame
          src={media.images[0].src}
          alt={media.images[0].alt}
          className="absolute inset-0 w-full h-full"
        />
      );
  }
}

export default function Chapter({
  chapter,
  reverse = false,
}: {
  chapter: ChapterType;
  reverse?: boolean;
}) {
  return (
    <section
      id={chapter.id}
      data-audio-zone={chapter.audioZone}
      className="relative w-full py-20 md:py-32"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian-0 via-obsidian-1 to-obsidian-0 pointer-events-none" />
      <div className="grain absolute inset-0 opacity-40 pointer-events-none" />

      <div
        className={`relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Text zone — compact sticky pill on mobile, full glass card on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 max-w-lg"
        >
          {/* Mobile: compact sticky kicker/title pill, body flows normally below */}
          <div className="md:hidden sticky top-20 z-20 glass-panel rounded-2xl px-5 py-4">
            <p className="text-champagne/80 text-xs uppercase tracking-[0.3em] font-light mb-2">
              {chapter.kicker}
            </p>
            <h2 className="font-display text-3xl leading-[1.05] text-ivory mb-1">
              {chapter.title}
            </h2>
            <p className="text-champagne-soft/70 text-sm font-light italic">
              {chapter.dateLabel}
            </p>
          </div>

          {/* Desktop: full text card, normal flow, never pinned */}
          <div className="hidden md:block">
            <p className="text-champagne/80 text-sm uppercase tracking-[0.3em] font-light mb-3">
              {chapter.kicker}
            </p>
            <h2 className="font-display text-5xl lg:text-6xl leading-[1.05] text-ivory mb-3">
              {chapter.title}
            </h2>
            <p className="text-champagne-soft/70 text-base font-light italic mb-6">
              {chapter.dateLabel}
            </p>
          </div>

          <div className="mt-4 md:mt-0 px-1 md:px-0">
            {chapter.body.map((p, i) => (
              <p
                key={i}
                className="text-ivory-dim text-base sm:text-lg leading-relaxed font-light mb-4"
              >
                {p}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Media zone — hard-clipped bounds, nothing can escape into the text column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative w-full aspect-[4/5] md:aspect-auto md:h-[62vh] md:max-h-[620px] rounded-2xl overflow-hidden glass-panel"
        >
          <ChapterMedia chapter={chapter} />
        </motion.div>
      </div>
    </section>
  );
}
