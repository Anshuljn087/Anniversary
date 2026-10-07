"use client";

import { motion } from "framer-motion";
import type { Chapter as ChapterType } from "@/data/journey";
import Headlights from "./Headlights";
import Dimmer from "./Dimmer";
import CafeNapkinInteraction from "./chapters/CafeNapkinInteraction";
import ResortKeycardsInteraction from "./chapters/ResortKeycardsInteraction";
import RingBoxInteraction from "./chapters/RingBoxInteraction";
import RoyalWeddingInteraction from "./chapters/RoyalWeddingInteraction";
import ThailandPassportInteraction from "./chapters/ThailandPassportInteraction";
import TravelPostcardsInteraction from "./chapters/TravelPostcardsInteraction";
import FairyLightsInteraction from "./chapters/FairyLightsInteraction";

function ChapterMedia({ chapter }: { chapter: ChapterType }) {
  const { media } = chapter;

  switch (media.type) {
    case "cafeNapkin":
      return <CafeNapkinInteraction />;
    case "resortKeycards":
      return <ResortKeycardsInteraction images={media.images} />;
    case "headlights":
      return <Headlights image={media.images[0]} />;
    case "ringBox":
      return <RingBoxInteraction />;
    case "royalWedding":
      return <RoyalWeddingInteraction images={media.images} />;
    case "dimmer":
      return <Dimmer image={media.images[0]} />;
    case "thailandPassport":
      return <ThailandPassportInteraction images={media.images} />;
    case "travelPostcards":
      return <TravelPostcardsInteraction images={media.images} />;
    case "fairyLights":
      return <FairyLightsInteraction image={media.images[0]} />;
    default:
      return null;
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
      className="relative w-full pt-28 pb-20 md:pt-32 md:pb-32"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian-0 via-obsidian-1 to-obsidian-0 pointer-events-none" />
      <div className="grain absolute inset-0 opacity-40 pointer-events-none" />

      <div
        className={`relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Text zone — plain normal-flow block at every breakpoint.
            (No position:sticky here: it sat inside this Framer Motion wrapper,
            whose animated `transform` creates a new containing block and breaks
            sticky's offset math, which let the body text below render on top
            of it. The fixed Header + section-level pt-28/pt-32 now does the
            job of keeping content clear of the top bar instead.) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 max-w-lg"
        >
          <p className="text-champagne/80 text-xs sm:text-sm uppercase tracking-[0.3em] font-light mb-3">
            {chapter.kicker}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ivory mb-3">
            {chapter.title}
          </h2>
          <p className="text-champagne-soft/70 text-sm sm:text-base font-light italic mb-6">
            {chapter.dateLabel}
          </p>

          {chapter.body.map((p, i) => (
            <p
              key={i}
              className="text-ivory-dim text-base sm:text-lg leading-relaxed font-light mb-4"
            >
              {p}
            </p>
          ))}
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
