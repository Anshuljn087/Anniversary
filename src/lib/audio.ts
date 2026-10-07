// Singleton Web Audio engine: a soft, synthesized romantic piano progression.
// No audio file dependency — works instantly on first user gesture.

const NOTE_FREQ: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99,
};

// A gentle I–V–vi–IV progression arpeggiated, looping.
const PATTERN: { chord: string[]; bass: string }[] = [
  { chord: ["C4", "E4", "G4"], bass: "C3" },
  { chord: ["G4", "B4", "D5"], bass: "G3" },
  { chord: ["A3", "C4", "E4"], bass: "A3" },
  { chord: ["F4", "A3", "C4"], bass: "F3" },
];

class PianoEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private playing = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private barIndex = 0;

  private ensureCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private pluck(freq: number, startTime: number, dur: number, gainAmt: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc2.type = "triangle";
    osc.frequency.value = freq;
    osc2.frequency.value = freq * 2;
    const g2 = ctx.createGain();
    g2.gain.value = 0.15;
    osc2.connect(g2);
    g2.connect(gain);
    osc.connect(gain);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainAmt, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

    gain.connect(this.master!);
    osc.start(startTime);
    osc2.start(startTime);
    osc.stop(startTime + dur + 0.05);
    osc2.stop(startTime + dur + 0.05);
  }

  private scheduleBar(startTime: number) {
    const bar = PATTERN[this.barIndex % PATTERN.length];
    this.barIndex++;
    const beat = 1.1;

    this.pluck(NOTE_FREQ[bar.bass] / 2, startTime, beat * 4, 0.06);

    bar.chord.forEach((note, i) => {
      const t = startTime + i * (beat * 0.6);
      this.pluck(NOTE_FREQ[note], t, beat * 1.4, 0.045);
    });
    bar.chord.slice().reverse().forEach((note, i) => {
      const t = startTime + beat * 2 + i * (beat * 0.6);
      this.pluck(NOTE_FREQ[note], t, beat * 1.4, 0.04);
    });

    const barDur = beat * 4;
    this.timer = setTimeout(() => {
      if (this.playing && this.ctx) this.scheduleBar(this.ctx.currentTime + 0.05);
    }, barDur * 1000 - 120);
  }

  async play() {
    const ctx = this.ensureCtx();
    if (ctx.state === "suspended") await ctx.resume();
    this.playing = true;
    this.master!.gain.cancelScheduledValues(ctx.currentTime);
    this.master!.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.2);
    this.scheduleBar(ctx.currentTime + 0.1);
  }

  pause() {
    if (!this.ctx || !this.master) return;
    this.playing = false;
    if (this.timer) clearTimeout(this.timer);
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6);
  }

  isPlaying() {
    return this.playing;
  }
}

let engine: PianoEngine | null = null;
export function getPianoEngine() {
  if (typeof window === "undefined") return null;
  if (!engine) engine = new PianoEngine();
  return engine;
}

// --- Microphone "blow" detection ---
// Listens to mic RMS energy over a short window; a sustained loud burst counts as a blow.
export type BlowDetector = {
  stop: () => void;
};

export async function startBlowDetection(onBlow: () => void): Promise<BlowDetector> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AC();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  source.connect(analyser);

  const data = new Uint8Array(analyser.frequencyBinCount);
  let sustainedFrames = 0;
  let fired = false;
  let raf = 0;

  const tick = () => {
    analyser.getByteFrequencyData(data);
    // Blowing into a mic energizes low-mid frequencies broadly; use RMS as a simple proxy.
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
    const rms = Math.sqrt(sum / data.length);

    if (rms > 35) {
      sustainedFrames++;
    } else {
      sustainedFrames = Math.max(0, sustainedFrames - 1);
    }

    if (sustainedFrames > 6 && !fired) {
      fired = true;
      onBlow();
    }

    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return {
    stop: () => {
      cancelAnimationFrame(raf);
      stream.getTracks().forEach((t) => t.stop());
      ctx.close();
    },
  };
}
