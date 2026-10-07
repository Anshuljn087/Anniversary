"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { Chapter as ChapterType, ChapterImage } from "@/data/journey";
import PhotoFrame from "./PhotoFrame";

const EXPLODE_OFFSETS = [
  { x: -120, y: -40, rot: -14 },
  { x: 130, y: 20, rot: 10 },
  { x: -40, y: 90, rot: 7 },
];

function GalleryImage({
  img,
  index,
  assemble,
  imgOpacity,
}: {
  img: ChapterImage;
  index: number;
  assemble: MotionValue<number>;
  imgOpacity: MotionValue<number>;
}) {
  const offset = EXPLODE_OFFSETS[index % EXPLODE_OFFSETS.length];
  const x = useTransform(assemble, [0, 1], [offset.x, (index - 1) * 24]);
  const y = useTransform(assemble, [0, 1], [offset.y, index * 14 - 14]);
  const rot = useTransform(assemble, [0, 1], [offset.rot, (index - 1) * 4]);

  return (
    <motion.div
      style={{ x, y, rotate: rot, opacity: imgOpacity, zIndex: 10 + index }}
      className="absolute w-[62%] sm:w-[56%] aspect-[4/5] rounded-2xl overflow-hidden glass-panel"
    >
      <PhotoFrame src={img.src} alt={img.alt} className="w-full h-full" />
      {img.caption && (
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
          <span className="text-ivory text-sm font-light tracking-wide">{img.caption}</span>
        </div>
      )}
    </motion.div>
  );
}

export default function Chapter({
  chapter,
  reverse = false,
  children,
}: {
  chapter: ChapterType;
  reverse?: boolean;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const textOpacity = useTransform(scrollYProgress, [0.15, 0.4, 0.75, 0.95], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.15, 0.4], [40, 0]);

  const assemble = useTransform(scrollYProgress, [0.1, 0.55], [0, 1]);
  const imgOpacity = useTransform(scrollYProgress, [0.08, 0.3, 0.85, 1], [0, 1, 1, 0.3]);
  const imgScale = useTransform(scrollYProgress, [0.1, 0.5, 1], [0.92, 1, 1.06]);
  const imgRotate = useTransform(scrollYProgress, [0, 1], [reverse ? 3 : -3, 0]);

  const isGallery = chapter.images.length > 1;

  return (
    <section
      ref={ref}
      className="relative min-h-[150vh] w-full"
      id={chapter.id}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-0 via-obsidian-1 to-obsidian-0" />
        <div className="grain absolute inset-0 opacity-50" />

        <div
          className={`relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${
            reverse ? "md:[&>*:first-child]:order-2" : ""
          }`}
        >
          <motion.div style={{ opacity: textOpacity, y: textY }} className="max-w-lg">
            <p className="text-champagne/80 text-xs sm:text-sm uppercase tracking-[0.3em] font-light mb-3">
              {chapter.kicker}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-ivory mb-3">
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

          <div className="relative h-[55vh] sm:h-[60vh] w-full flex items-center justify-center">
            {children ? (
              <motion.div style={{ opacity: imgOpacity }} className="w-full h-full">
                {children}
              </motion.div>
            ) : isGallery ? (
              chapter.images.map((img, i) => (
                <GalleryImage
                  key={img.src}
                  img={img}
                  index={i}
                  assemble={assemble}
                  imgOpacity={imgOpacity}
                />
              ))
            ) : (
              <motion.div
                style={{
                  opacity: imgOpacity,
                  scale: imgScale,
                  rotate: imgRotate,
                }}
                className="relative w-[85%] sm:w-[75%] aspect-[4/5] rounded-2xl overflow-hidden glass-panel"
              >
                <PhotoFrame
                  src={chapter.images[0].src}
                  alt={chapter.images[0].alt}
                  className="w-full h-full"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
