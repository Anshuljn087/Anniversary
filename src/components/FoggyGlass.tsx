"use client";

import { useEffect, useRef, useState } from "react";
import type { ChapterImage } from "@/data/journey";
import PhotoFrame from "./PhotoFrame";

export default function FoggyGlass({ image }: { image: ChapterImage }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cleared, setCleared] = useState(0); // 0..1 approx fraction wiped
  const drawing = useRef(false);
  const clearedPixels = useRef(0);
  const totalPixels = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // condensation fog: layered noise-ish gradient + fine droplets
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

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const wipe = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

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
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-2xl overflow-hidden glass-panel cursor-none touch-none select-none"
    >
      <PhotoFrame src={image.src} alt={image.alt} className="absolute inset-0 w-full h-full" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onPointerDown={(e) => {
          drawing.current = true;
          wipe(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (drawing.current) wipe(e.clientX, e.clientY);
        }}
        onPointerUp={() => (drawing.current = false)}
        onPointerLeave={() => (drawing.current = false)}
      />

      {cleared < 0.08 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ivory/70 text-xs sm:text-sm uppercase tracking-[0.25em] font-light pointer-events-none">
          Swipe to wipe the glass
        </div>
      )}
    </div>
  );
}
