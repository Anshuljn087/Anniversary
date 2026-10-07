"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { startBlowDetection, type BlowDetector } from "@/lib/audio";

type Smoke = { id: number; x: number };

export default function CandleCake({
  candleCount = 2,
  labels,
  prompt = "Make a wish, together.",
  onBlownOut,
}: {
  candleCount?: number;
  labels?: string[];
  prompt?: string;
  onBlownOut: () => void;
}) {
  const [litCount, setLitCount] = useState(candleCount);
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [smoke, setSmoke] = useState<Smoke[]>([]);
  const [micStatus, setMicStatus] = useState<"idle" | "listening" | "denied">("idle");
  const detectorRef = useRef<BlowDetector | null>(null);
  const holdRaf = useRef<number | null>(null);
  const smokeId = useRef(0);
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    setLitCount(0);
    const newSmoke = Array.from({ length: candleCount }, () => ({
      id: smokeId.current++,
      x: -20 + Math.random() * 40,
    }));
    setSmoke(newSmoke);
    detectorRef.current?.stop();
    setTimeout(onBlownOut, 1200);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const detector = await startBlowDetection(() => {
          if (mounted) finish();
        });
        if (!mounted) {
          detector.stop();
          return;
        }
        detectorRef.current = detector;
        setMicStatus("listening");
      } catch {
        setMicStatus("denied");
      }
    })();
    return () => {
      mounted = false;
      detectorRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startHold = () => {
    setHolding(true);
    const start = performance.now();
    const DURATION = 1100;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      setHoldProgress(p);
      if (p >= 1) {
        finish();
        return;
      }
      holdRaf.current = requestAnimationFrame(step);
    };
    holdRaf.current = requestAnimationFrame(step);
  };

  const endHold = () => {
    setHolding(false);
    setHoldProgress(0);
    if (holdRaf.current) cancelAnimationFrame(holdRaf.current);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center pointer-events-auto">
      <div className="relative flex items-end gap-8 sm:gap-10 mb-8">
        {Array.from({ length: candleCount }).map((_, i) => (
          <div key={i} className="relative flex flex-col items-center">
            <div className="relative h-16 sm:h-24 flex items-end justify-center">
              <AnimatePresence>
                {litCount > 0 && (
                  <motion.div
                    exit={{ opacity: 0, scale: 0.3, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="absolute bottom-full mb-0.5 pointer-events-none"
                  >
                    <div className="relative">
                      <div
                        className="animate-flicker w-3 h-6 sm:w-4 sm:h-8 rounded-[50%_50%_50%_50%/_60%_60%_40%_40%] bg-gradient-to-t from-amber-500 via-champagne-soft to-ivory"
                        style={{ filter: "blur(0.3px)" }}
                      />
                      <div className="absolute -inset-2 rounded-full bg-champagne/30 blur-md animate-pulse-slow" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="w-4 sm:w-5 h-full rounded-sm bg-gradient-to-b from-ivory via-ivory/90 to-champagne-soft/80 shadow-inner" />
            </div>
            {labels?.[i] && (
              <span className="mt-3 text-champagne/70 text-xs tracking-[0.2em] uppercase font-light">
                {labels[i]}
              </span>
            )}
          </div>
        ))}

        {/* cake base */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[140%] h-8 rounded-[50%] bg-gradient-to-b from-champagne-soft/40 to-transparent -z-10 pointer-events-none" />

        <AnimatePresence>
          {smoke.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0.6, y: 0 }}
              animate={{ opacity: 0, y: -90 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              style={{ left: `calc(50% + ${s.x}px)` }}
              className="absolute bottom-16 w-6 h-6 rounded-full bg-ivory/40 blur-md pointer-events-none"
            />
          ))}
        </AnimatePresence>
      </div>

      <p className="font-display text-xl sm:text-2xl text-ivory mb-6 text-center px-6">
        {prompt}
      </p>

      <button
        onPointerDown={startHold}
        onPointerUp={endHold}
        onPointerLeave={endHold}
        className="glass-panel relative overflow-hidden rounded-full px-6 py-3 text-sm sm:text-base text-ivory/90 font-light tracking-wide select-none touch-none cursor-pointer"
      >
        <span
          className="absolute inset-0 origin-left bg-champagne/30"
          style={{
            transform: `scaleX(${holding ? holdProgress : 0})`,
            transition: holding ? "none" : "transform 0.2s",
          }}
        />
        <span className="relative">Tap or hold to blow the candles</span>
      </button>

      <p className="mt-3 text-ivory/40 text-xs font-light tracking-wide h-4">
        {micStatus === "listening"
          ? "or just blow into your mic 🕯️"
          : micStatus === "denied"
          ? "mic unavailable — use the button above"
          : " "}
      </p>
    </div>
  );
}
