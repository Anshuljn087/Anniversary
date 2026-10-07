"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane } from "lucide-react";
import type { ChapterImage } from "@/data/journey";
import PhotoCarousel from "../media/PhotoCarousel";
import { getDynamicAudioEngine } from "@/lib/dynamicAudio";

export default function ThailandPassportInteraction({ images }: { images: ChapterImage[] }) {
  const [stamped, setStamped] = useState(false);

  const handleStamp = () => {
    if (stamped) return;
    getDynamicAudioEngine()?.playOneShot("stamp");
    setStamped(true);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {!stamped ? (
          <motion.button
            key="pass"
            onClick={handleStamp}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.4 }}
            className="relative w-[82%] sm:w-[340px] aspect-[16/9] rounded-xl bg-gradient-to-br from-[#e8e2d0] via-[#ddd4ba] to-[#c9bd9c] shadow-2xl cursor-pointer overflow-hidden text-left"
            aria-label="Stamp the passport"
          >
            <div className="absolute inset-0 opacity-[0.08] bg-[repeating-linear-gradient(45deg,#000_0,#000_1px,transparent_1px,transparent_10px)]" />
            <div className="relative h-full flex flex-col justify-between p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-obsidian-0/70 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium">
                  Boarding Pass
                </span>
                <Plane size={16} className="text-obsidian-0/50" strokeWidth={1.5} />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-display text-xl sm:text-2xl text-obsidian-0/85">BKK → HKT</p>
                  <p className="text-obsidian-0/50 text-[10px] sm:text-xs tracking-wide">
                    Bangkok to Phuket · Honeymoon Class
                  </p>
                </div>
                <span className="text-obsidian-0/40 text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">
                  Tap to stamp
                </span>
              </div>
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="album"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative w-full h-full"
          >
            <PhotoCarousel images={images} />

            <motion.div
              initial={{ scale: 2.5, opacity: 0, rotate: -18 }}
              animate={{ scale: 1, opacity: 1, rotate: -18 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute top-4 right-4 z-30 pointer-events-none border-[3px] border-[#a3122a] rounded-md px-2.5 py-1.5 bg-[#a3122a]/10"
            >
              <span className="text-[#a3122a] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Love
                <br />
                Approved
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
