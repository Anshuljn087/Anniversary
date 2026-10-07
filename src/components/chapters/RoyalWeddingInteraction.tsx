"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";
import type { ChapterImage } from "@/data/journey";
import PhotoFrame from "../PhotoFrame";
import { getDynamicAudioEngine } from "@/lib/dynamicAudio";

type Petal = {
  x: number;
  y: number;
  vy: number;
  sway: number;
  swaySpeed: number;
  rot: number;
  rotSpeed: number;
  size: number;
  gold: boolean;
};

function PetalCanvas({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petals = useRef<Petal[]>([]);
  const raf = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (trigger === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newPetals: Petal[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      vy: 0.8 + Math.random() * 1.4,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.015 + Math.random() * 0.02,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 4,
      size: 6 + Math.random() * 7,
      gold: Math.random() > 0.78,
    }));
    petals.current = [...petals.current, ...newPetals];

    let frames = 0;
    const draw = () => {
      frames++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.current.forEach((p) => {
        p.y += p.vy;
        p.sway += p.swaySpeed;
        p.x += Math.sin(p.sway) * 1.2;
        p.rot += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        if (p.gold) {
          ctx.fillStyle = "rgba(212,175,55,0.85)";
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = "rgba(139,0,30,0.85)";
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      petals.current = petals.current.filter((p) => p.y < canvas.height + 30);

      if (frames < 420 && petals.current.length > 0) {
        raf.current = requestAnimationFrame(draw);
      }
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(raf.current);
  }, [trigger]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-30" />;
}

function RitualCarousel({ images }: { images: ChapterImage[] }) {
  return (
    <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto pointer-events-none">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        {images.map((img, i) => {
          const angle = (i / images.length) * 360;
          const radius = 56;
          return (
            <div
              key={img.src}
              className="absolute top-1/2 left-1/2 w-14 h-14 sm:w-16 sm:h-16 -mt-7 -ml-7 sm:-mt-8 sm:-ml-8"
              style={{
                transform: `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`,
              }}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                className="w-full h-full rounded-full overflow-hidden ring-2 ring-champagne-soft/50 shadow-lg"
              >
                <PhotoFrame src={img.src} alt={img.alt} className="w-full h-full" />
              </motion.div>
            </div>
          );
        })}
      </motion.div>
      <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-obsidian-1/80 backdrop-blur-sm flex items-center justify-center">
        <Flower2 size={16} className="text-champagne/70" strokeWidth={1.5} />
      </div>
    </div>
  );
}

export default function RoyalWeddingInteraction({ images }: { images: ChapterImage[] }) {
  const [trigger, setTrigger] = useState(0);

  const shower = () => {
    setTrigger((t) => t + 1);
    getDynamicAudioEngine()?.playOneShot("petals");
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-5 overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a0f16] via-obsidian-1 to-obsidian-0 pointer-events-none" />

      <RitualCarousel images={images} />

      <button
        onClick={shower}
        className="relative z-20 glass-panel rounded-full px-6 py-3 text-sm sm:text-base text-ivory/90 font-light tracking-wide cursor-pointer"
      >
        Shower Rose Petals 🌸
      </button>

      <PetalCanvas trigger={trigger} />
    </div>
  );
}
