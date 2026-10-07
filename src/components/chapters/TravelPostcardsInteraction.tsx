"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Stamp } from "lucide-react";
import type { ChapterImage } from "@/data/journey";
import PhotoFrame from "../PhotoFrame";
import { getDynamicAudioEngine } from "@/lib/dynamicAudio";

function Postcard({ image }: { image: ChapterImage }) {
  const [flipped, setFlipped] = useState(false);

  const toggle = () => {
    setFlipped((f) => !f);
    getDynamicAudioEngine()?.playOneShot("flip");
  };

  return (
    <button
      onClick={toggle}
      className="relative w-full h-full cursor-pointer"
      style={{ perspective: 1000 }}
      aria-label={`Flip ${image.caption} postcard`}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full rounded-lg shadow-xl"
      >
        {/* front */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0 rounded-lg overflow-hidden border-4 border-ivory"
        >
          <PhotoFrame src={image.src} alt={image.alt} className="absolute inset-0 w-full h-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
            <span className="text-ivory text-xs font-light tracking-wide">{image.caption}</span>
          </div>
        </div>

        {/* back */}
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#f1e9d8] to-[#ddd1b0] border-4 border-ivory p-3 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="h-full w-[55%] flex flex-col gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="block h-px bg-obsidian-0/15 mt-3" />
              ))}
            </div>
            <div className="flex flex-col items-center text-obsidian-0/50 border border-obsidian-0/20 rounded px-1.5 py-1">
              <Stamp size={14} strokeWidth={1.5} />
              <span className="text-[8px] uppercase tracking-wider mt-0.5">Post</span>
            </div>
          </div>
          <div>
            <p className="font-display text-obsidian-0/80 text-base sm:text-lg leading-tight">
              {image.caption}
            </p>
            <p className="text-obsidian-0/50 text-[10px] uppercase tracking-[0.15em] mt-0.5">
              {image.meta}
            </p>
          </div>
        </div>
      </motion.div>
    </button>
  );
}

export default function TravelPostcardsInteraction({ images }: { images: ChapterImage[] }) {
  return (
    <div className="relative w-full h-full grid grid-cols-1 sm:grid-cols-3 gap-3 p-3">
      {images.map((img) => (
        <Postcard key={img.src} image={img} />
      ))}
    </div>
  );
}
