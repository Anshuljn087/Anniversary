"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Heart } from "lucide-react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const blur = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <section
      ref={ref}
      className="relative h-[100vh] w-full overflow-hidden flex items-center justify-center bg-obsidian-0"
    >
      <motion.div
        style={{ scale, filter }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.14),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.08),_transparent_55%)]" />
        <div className="grain absolute inset-0" />
      </motion.div>

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="flex items-center gap-2 text-champagne/90 mb-6 tracking-[0.3em] text-xs sm:text-sm uppercase font-light"
        >
          <Heart size={14} strokeWidth={1.5} />
          <span>8th October</span>
          <Heart size={14} strokeWidth={1.5} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-gradient-gold text-[14vw] sm:text-[9vw] md:text-[7.5vw] leading-[0.95] font-medium"
        >
          Two Years
          <br />
          of Us
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-6 max-w-md text-ivory-dim text-base sm:text-lg font-light tracking-wide"
        >
          A love letter in eleven chapters, for the woman who made every one of them worth living.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-16 flex flex-col items-center gap-2 text-ivory/50"
        >
          <span className="text-xs tracking-[0.25em] uppercase font-light">
            Scroll our story
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={18} strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
