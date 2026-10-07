"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { ChapterImage } from "@/data/journey";
import PhotoFrame from "../PhotoFrame";

export default function BentoGallery({ images }: { images: ChapterImage[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 p-2">
        {images.map((img, i) => (
          <motion.button
            key={img.src}
            onClick={() => setActive(i)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative overflow-hidden rounded-xl cursor-pointer ${
              i === 0 ? "col-span-2 row-span-1" : "col-span-1 row-span-1"
            }`}
          >
            <PhotoFrame
              src={img.src}
              alt={img.alt}
              className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors pointer-events-none" />
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                <span className="text-ivory text-xs sm:text-sm font-light tracking-wide">
                  {img.caption}
                </span>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl aspect-[4/3] rounded-2xl overflow-hidden glass-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <PhotoFrame
                src={images[active].src}
                alt={images[active].alt}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              {images[active].caption && (
                <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                  <span className="text-ivory text-base font-light tracking-wide">
                    {images[active].caption}
                  </span>
                </div>
              )}
            </motion.div>

            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="glass-panel absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-ivory/90 cursor-pointer"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
