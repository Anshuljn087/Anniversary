"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { startBlowDetection, type BlowDetector } from "@/lib/audio";

type Smoke = { id: number; x: number };

export default function CandleBlow({ onBlownOut }: { onBlownOut: () => void }) {
  const [litCount, setLitCount] = useState(2);
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
    const newSmoke = [0, 1].map(() => ({ id: smokeId.current++, x: -20 + Math.random() * 40 }));
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
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* candles */}
      <div className="relative flex items-end gap-10 sm:gap-14 mb-10">
        {[0, 1].map((i) => (
          <div key={i} className="relative flex flex-col items-center">
            <div className="relative h-20 sm:h-28 flex items-end justify-center">
              <AnimatePresence>
                {litCount > 0 && (
                  <motion.div
                    exit={{ opacity: 0, scale: 0.3, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="absolute bottom-full mb-0.5"
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
              <div className="w-5 sm:w-6 h-full rounded-sm bg-gradient-to-b from-ivory via-ivory/90 to-champagne-soft/80 shadow-inner" />
            </div>
            <span className="mt-3 text-champagne/70 text-xs tracking-[0.2em] uppercase font-light">
              {i === 0 ? "Year One" : "Year Two"}
            </span>
          </div>
        ))}

        {/* smoke after blow out */}
        <AnimatePresence>
          {smoke.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0.6, y: 0 }}
              animate={{ opacity: 0, y: -90 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              style={{ left: `calc(50% + ${s.x}px)` }}
              className="absolute bottom-20 w-6 h-6 rounded-full bg-ivory/40 blur-md"
            />
          ))}
        </AnimatePresence>
      </div>

      <p className="font-display text-2xl sm:text-3xl text-ivory mb-8 text-center px-6">
        Make a wish, together.
      </p>

      <button
        onPointerDown={startHold}
        onPointerUp={endHold}
        onPointerLeave={endHold}
        className="glass-panel relative overflow-hidden rounded-full px-7 py-3.5 text-sm sm:text-base text-ivory/90 font-light tracking-wide select-none touch-none"
      >
        <span
          className="absolute inset-0 origin-left bg-champagne/30"
          style={{ transform: `scaleX(${holding ? holdProgress : 0})`, transition: holding ? "none" : "transform 0.2s" }}
        />
        <span className="relative">Hold or Tap to Blow the Candles</span>
      </button>

      <p className="mt-4 text-ivory/40 text-xs font-light tracking-wide">
        {micStatus === "listening"
          ? "or just blow into your mic 🕯️"
          : micStatus === "denied"
          ? "mic unavailable — use the button above"
          : " "}
      </p>
    </div>
  );
}
