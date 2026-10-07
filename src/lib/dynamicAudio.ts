import type { AudioZoneId } from "@/data/journey";
import { audioZones, type AudioZoneConfig } from "@/data/audioConfig";

const NOTE_FREQ: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
};

type Timbre = "soft" | "reed" | "pluck" | "pad";

type Preset = {
  timbre: Timbre;
  tempoMs: number;
  steps: { notes: string[]; dur: number; gain: number }[];
  drone?: string;
};

const PRESETS: Record<string, Preset> = {
  "lofi-acoustic": {
    timbre: "soft",
    tempoMs: 1300,
    steps: [
      { notes: ["C3", "C4", "E4", "G4"], dur: 1.6, gain: 0.05 },
      { notes: ["G3", "G4", "B4", "D5"], dur: 1.6, gain: 0.05 },
      { notes: ["A3", "A3", "C4", "E4"], dur: 1.6, gain: 0.05 },
      { notes: ["F3", "F4", "A3", "C4"], dur: 1.6, gain: 0.05 },
    ],
  },
  "shehnai-chords": {
    timbre: "reed",
    tempoMs: 620,
    drone: "D3",
    steps: [
      { notes: ["D4"], dur: 0.5, gain: 0.07 },
      { notes: ["F4"], dur: 0.5, gain: 0.065 },
      { notes: ["G4"], dur: 0.5, gain: 0.07 },
      { notes: ["A4"], dur: 0.6, gain: 0.075 },
      { notes: ["C5"], dur: 0.5, gain: 0.07 },
      { notes: ["A4"], dur: 0.5, gain: 0.065 },
      { notes: ["G4"], dur: 0.5, gain: 0.065 },
      { notes: ["F4"], dur: 0.5, gain: 0.06 },
    ],
  },
  "tropical-marimba": {
    timbre: "pluck",
    tempoMs: 430,
    steps: [
      { notes: ["C4"], dur: 0.35, gain: 0.06 },
      { notes: ["E4"], dur: 0.3, gain: 0.05 },
      { notes: ["G4"], dur: 0.35, gain: 0.06 },
      { notes: ["A4"], dur: 0.3, gain: 0.05 },
      { notes: ["G4"], dur: 0.3, gain: 0.05 },
      { notes: ["E4"], dur: 0.3, gain: 0.045 },
      { notes: ["D4"], dur: 0.35, gain: 0.05 },
      { notes: ["C4"], dur: 0.35, gain: 0.055 },
    ],
  },
  "emotional-piano": {
    timbre: "pad",
    tempoMs: 1900,
    steps: [
      { notes: ["A3", "C4", "E4"], dur: 2.4, gain: 0.055 },
      { notes: ["F3", "A3", "C4"], dur: 2.4, gain: 0.05 },
      { notes: ["C4", "E4", "G4"], dur: 2.4, gain: 0.055 },
      { notes: ["G3", "B3", "D4"], dur: 2.4, gain: 0.05 },
    ],
  },
  "drive-beats": {
    timbre: "pluck",
    tempoMs: 340,
    steps: [
      { notes: ["C3"], dur: 0.2, gain: 0.07 },
      { notes: ["C4"], dur: 0.12, gain: 0.03 },
      { notes: ["G3"], dur: 0.2, gain: 0.05 },
      { notes: ["C4"], dur: 0.12, gain: 0.03 },
      { notes: ["A3"], dur: 0.2, gain: 0.065 },
      { notes: ["C4"], dur: 0.12, gain: 0.03 },
      { notes: ["G3"], dur: 0.2, gain: 0.05 },
      { notes: ["E4"], dur: 0.15, gain: 0.035 },
    ],
  },
};

type OneShotKind =
  | "chime"
  | "beep"
  | "sparkle"
  | "stamp"
  | "petals"
  | "cord"
  | "flip"
  | "unlock";

type ZoneRuntime = {
  config: AudioZoneConfig;
  gain: GainNode;
  filter?: BiquadFilterNode;
  audioEl?: HTMLAudioElement;
  usingFile: boolean;
  timer: ReturnType<typeof setTimeout> | null;
  stepIndex: number;
  started: boolean;
};

class DynamicAudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private zones = new Map<AudioZoneId, ZoneRuntime>();
  private activeZone: AudioZoneId | null = null;
  private playing = false;

  private ensureCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.9;
      this.sfxGain.connect(this.ctx.destination);

      for (const config of audioZones) {
        const gain = this.ctx.createGain();
        gain.gain.value = 0;
        gain.connect(this.master);

        const zone: ZoneRuntime = {
          config,
          gain,
          usingFile: false,
          timer: null,
          stepIndex: 0,
          started: false,
        };
        this.zones.set(config.id, zone);

        const audioEl = new Audio();
        audioEl.loop = true;
        audioEl.preload = "auto";
        audioEl.volume = 1;
        audioEl.addEventListener("canplaythrough", () => {
          if (zone.usingFile) return;
          zone.usingFile = true;
          const node = this.ctx!.createMediaElementSource(audioEl);
          node.connect(gain);
          zone.audioEl = audioEl;
          if (this.playing) audioEl.play().catch(() => {});
        });
        audioEl.addEventListener("error", () => {
          // no file at this path — synth fallback (already scheduled) carries the zone
        });
        audioEl.src = config.audioSrc;
      }
    }
    return this.ctx;
  }

  private pluck(
    out: AudioNode,
    freq: number,
    startTime: number,
    dur: number,
    gainAmt: number,
    timbre: Timbre
  ) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    let attack = 0.04;
    let curve: "exp" | "lin" = "exp";

    switch (timbre) {
      case "soft":
        osc.type = "sine";
        break;
      case "reed":
        osc.type = "sawtooth";
        attack = 0.08;
        break;
      case "pluck":
        osc.type = "triangle";
        attack = 0.01;
        curve = "exp";
        break;
      case "pad":
        osc.type = "sine";
        attack = 0.3;
        curve = "lin";
        break;
    }

    osc.frequency.value = freq;

    let node: AudioNode = osc;
    if (timbre === "reed") {
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = freq * 2.2;
      filter.Q.value = 3.5;
      osc.connect(filter);
      node = filter;

      // slow vibrato for a reedy, ornamented feel
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 5.5;
      lfoGain.gain.value = 4;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.detune);
      lfo.start(startTime);
      lfo.stop(startTime + dur + 0.1);
    }

    // harmonic layer for warmth
    const osc2 = ctx.createOscillator();
    osc2.type = timbre === "pluck" ? "sine" : "triangle";
    osc2.frequency.value = freq * 2;
    const g2 = ctx.createGain();
    g2.gain.value = 0.15;
    osc2.connect(g2);
    g2.connect(gain);

    node.connect(gain);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainAmt, startTime + attack);
    if (curve === "exp") {
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);
    } else {
      gain.gain.linearRampToValueAtTime(0, startTime + dur);
    }

    gain.connect(out);
    osc.start(startTime);
    osc2.start(startTime);
    osc.stop(startTime + dur + 0.1);
    osc2.stop(startTime + dur + 0.1);
  }

  private thud(out: AudioNode, startTime: number, freq = 90, dur = 0.18, gainAmt = 0.4) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * 1.8, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, startTime + dur);
    gain.gain.setValueAtTime(gainAmt, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);
    osc.connect(gain);
    gain.connect(out);
    osc.start(startTime);
    osc.stop(startTime + dur + 0.05);
  }

  async playOneShot(kind: OneShotKind) {
    const ctx = this.ensureCtx();
    if (ctx.state === "suspended") await ctx.resume();
    const out = this.sfxGain!;
    const t = ctx.currentTime + 0.02;

    switch (kind) {
      case "chime":
        this.pluck(out, NOTE_FREQ.C5, t, 0.9, 0.12, "soft");
        this.pluck(out, NOTE_FREQ.E5, t + 0.1, 0.9, 0.1, "soft");
        break;
      case "unlock":
        this.pluck(out, NOTE_FREQ.G4, t, 0.3, 0.1, "pluck");
        this.pluck(out, NOTE_FREQ.C5, t + 0.08, 0.5, 0.11, "pluck");
        break;
      case "beep":
        this.pluck(out, NOTE_FREQ.A5, t, 0.08, 0.1, "pluck");
        this.pluck(out, NOTE_FREQ.A5, t + 0.12, 0.08, 0.1, "pluck");
        break;
      case "sparkle": {
        const notes = ["C5", "E5", "G5", "C5", "A5"] as const;
        notes.forEach((n, i) => this.pluck(out, NOTE_FREQ[n], t + i * 0.08, 0.5, 0.07, "pluck"));
        break;
      }
      case "stamp":
        this.thud(out, t, 85, 0.15, 0.5);
        break;
      case "petals":
        this.pluck(out, NOTE_FREQ.A4, t, 0.5, 0.08, "reed");
        this.pluck(out, NOTE_FREQ.F4, t + 0.18, 0.5, 0.07, "reed");
        this.pluck(out, NOTE_FREQ.D4, t + 0.36, 0.7, 0.07, "reed");
        break;
      case "cord":
        this.pluck(out, NOTE_FREQ.G4, t, 0.6, 0.09, "soft");
        break;
      case "flip":
        this.pluck(out, NOTE_FREQ.E5, t, 0.18, 0.06, "pluck");
        this.pluck(out, NOTE_FREQ.C5, t + 0.06, 0.18, 0.05, "pluck");
        break;
    }
  }

  private scheduleZone(zone: ZoneRuntime) {
    const preset = PRESETS[zone.config.toneFrequency];
    if (!preset || !this.ctx) return;

    const now = this.ctx.currentTime + 0.05;
    const step = preset.steps[zone.stepIndex % preset.steps.length];
    zone.stepIndex++;

    if (preset.drone && zone.stepIndex === 1) {
      this.pluck(zone.gain, NOTE_FREQ[preset.drone] / 2, now, preset.tempoMs * preset.steps.length * 0.001 + 2, 0.03, "pad");
    }

    step.notes.forEach((note) => {
      this.pluck(zone.gain, NOTE_FREQ[note], now, step.dur, step.gain, preset.timbre);
    });

    zone.timer = setTimeout(() => {
      if (this.playing) this.scheduleZone(zone);
    }, preset.tempoMs);
  }

  private startZoneLoop(zone: ZoneRuntime) {
    if (zone.started) return;
    zone.started = true;
    this.scheduleZone(zone);
  }

  async play() {
    const ctx = this.ensureCtx();
    if (ctx.state === "suspended") await ctx.resume();
    this.playing = true;
    this.master!.gain.cancelScheduledValues(ctx.currentTime);
    this.master!.gain.linearRampToValueAtTime(1, ctx.currentTime + 1);
    for (const zone of this.zones.values()) {
      this.startZoneLoop(zone);
      if (zone.usingFile) zone.audioEl?.play().catch(() => {});
    }
    if (this.activeZone) this.setActiveZone(this.activeZone, true);
  }

  pause() {
    if (!this.ctx || !this.master) return;
    this.playing = false;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    for (const zone of this.zones.values()) {
      if (zone.timer) clearTimeout(zone.timer);
      zone.started = false;
      zone.audioEl?.pause();
    }
  }

  setActiveZone(zoneId: AudioZoneId, force = false) {
    if (!this.ctx) {
      this.activeZone = zoneId;
      return;
    }
    if (zoneId === this.activeZone && !force) return;
    this.activeZone = zoneId;
    const now = this.ctx.currentTime;
    for (const [id, zone] of this.zones) {
      const target = id === zoneId ? 1 : 0;
      zone.gain.gain.cancelScheduledValues(now);
      zone.gain.gain.setValueAtTime(zone.gain.gain.value, now);
      zone.gain.gain.linearRampToValueAtTime(target, now + 1.5);
    }
  }

  getActiveZoneLabel(): string {
    if (!this.activeZone) return "Our Song";
    return audioZones.find((z) => z.id === this.activeZone)?.label ?? "Our Song";
  }

  isPlaying() {
    return this.playing;
  }
}

let engine: DynamicAudioEngine | null = null;
export function getDynamicAudioEngine() {
  if (typeof window === "undefined") return null;
  if (!engine) engine = new DynamicAudioEngine();
  return engine;
}
