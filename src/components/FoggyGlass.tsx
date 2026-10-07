"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { ChapterImage } from "@/data/journey";
import PhotoFrame from "./PhotoFrame";

export default function FoggyGlass({ image }: { image: ChapterImage }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cleared, setCleared] = useState(0); // 0..1 approx fraction wiped
  const [revealed, setRevealed] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const drawing = useRef(false);
  const clearedPixels = useRef(0);
  const totalPixels = useRef(1);

  const paintFog = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#cfd6de");
    grad.addColorStop(1, "#aab3bd");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 260; i++) {
      const r = Math.random() * 10 + 2;
      ctx.beginPath();
      ctx.fillStyle = Math.random() > 0.5 ? "#e8edf1" : "#9aa3ad";
      ctx.arc(Math.random() * width, Math.random() * height, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    totalPixels.current = width * height;
    clearedPixels.current = 0;
    setCleared(0);
  };

  useEffect(() => {
    paintFog();
    window.addEventListener("resize", paintFog);
    return () => window.removeEventListener("resize", paintFog);
  }, []);

  const wipe = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setCursorPos({ x: clientX - rect.left, y: clientY - rect.top });

    const radius = 46;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    clearedPixels.current += Math.PI * radius * radius * 0.6;
    const ratio = Math.min(1, clearedPixels.current / totalPixels.current);
    setCleared(ratio);
    if (ratio > 0.55) setRevealed(true);
  };

  const revealPhoto = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCleared(1);
    setRevealed(true);
  };

  const resetFog = () => {
    paintFog();
    setRevealed(false);
    setCursorPos(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-none touch-none select-none"
    >
      <PhotoFrame src={image.src} alt={image.alt} className="absolute inset-0 w-full h-full pointer-events-none" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onPointerDown={(e) => {
          drawing.current = true;
          setIsDrawing(true);
          wipe(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          setCursorPos({
            x: e.clientX - e.currentTarget.getBoundingClientRect().left,
            y: e.clientY - e.currentTarget.getBoundingClientRect().top,
          });
          if (drawing.current) wipe(e.clientX, e.clientY);
        }}
        onPointerUp={() => {
          drawing.current = false;
          setIsDrawing(false);
        }}
        onPointerLeave={() => {
          drawing.current = false;
          setIsDrawing(false);
          setCursorPos(null);
        }}
      />

      {/* visible cloth cursor so the user always sees where they're wiping */}
      <AnimatePresence>
        {cursorPos && !revealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: isDrawing ? 1.08 : 1, rotate: isDrawing ? [0, -8, 8, 0] : 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25 }}
            className="absolute z-20 pointer-events-none"
            style={{ left: cursorPos.x - 26, top: cursorPos.y - 26 }}
          >
            <div className="w-[52px] h-[52px] rounded-full bg-ivory/90 shadow-lg border-2 border-white/60 flex items-center justify-center">
              <span className="block w-6 h-6 rounded-full bg-gradient-to-br from-white to-ivory-dim" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {cleared < 0.08 && !revealed && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ivory/70 text-xs sm:text-sm uppercase tracking-[0.25em] font-light pointer-events-none text-center px-4">
          Swipe to wipe the mirror
        </div>
      )}

      {!revealed && (
        <button
          onClick={revealPhoto}
          className="glass-panel absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs text-ivory/90 font-light tracking-wide cursor-pointer"
        >
          <Sparkles size={13} strokeWidth={1.75} />
          Reveal Photo
        </button>
      )}

      {revealed && (
        <button
          onClick={resetFog}
          className="glass-panel absolute top-4 right-4 z-20 rounded-full px-3.5 py-2 text-xs text-ivory/70 font-light tracking-wide cursor-pointer"
        >
          Fog it up again
        </button>
      )}
    </div>
  );
}
