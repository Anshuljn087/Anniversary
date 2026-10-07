"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ChapterImage } from "@/data/journey";
import PhotoFrame from "../PhotoFrame";

export default function PhotoCarousel({ images }: { images: ChapterImage[] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(0);

  const go = (next: number) => {
    const wrapped = (next + images.length) % images.length;
    setDir(next > index ? 1 : -1);
    setIndex(wrapped);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout" custom={dir}>
        <motion.div
          key={index}
          custom={dir}
          initial={{ x: dir >= 0 ? "100%" : "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: dir >= 0 ? "-100%" : "100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(index + 1);
            else if (info.offset.x > 60) go(index - 1);
          }}
          className="absolute inset-0 touch-pan-y"
        >
          <PhotoFrame
            src={images[index].src}
            alt={images[index].alt}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
          {images[index].caption && (
            <div className="absolute bottom-14 left-0 right-0 px-5 text-center pointer-events-none">
              <span className="text-ivory text-sm font-light tracking-wide drop-shadow">
                {images[index].caption}
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* decorative edge gradients for legibility — never intercept input */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      <button
        onClick={() => go(index - 1)}
        aria-label="Previous photo"
        className="glass-panel absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center text-ivory/90 cursor-pointer"
      >
        <ChevronLeft size={16} strokeWidth={1.75} />
      </button>
      <button
        onClick={() => go(index + 1)}
        aria-label="Next photo"
        className="glass-panel absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center text-ivory/90 cursor-pointer"
      >
        <ChevronRight size={16} strokeWidth={1.75} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {images.map((img, i) => (
          <button
            key={img.src}
            onClick={() => go(i)}
            aria-label={`Go to photo ${i + 1}`}
            className="cursor-pointer p-1"
          >
            <span
              className={`block rounded-full transition-all ${
                i === index ? "w-5 h-1.5 bg-champagne" : "w-1.5 h-1.5 bg-ivory/40"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
