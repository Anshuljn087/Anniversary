import type { AudioZoneId } from "./journey";

export type AudioZoneConfig = {
  id: AudioZoneId;
  label: string;
  audioSrc: string;
  toneFrequency: string;
};

// Drop a matching .mp3 into /public/music to replace the synthesized fallback —
// no code changes needed, DynamicAudioManager prefers the real file automatically.
export const audioZones: AudioZoneConfig[] = [
  {
    id: "romantic",
    label: "Acoustic Mornings",
    audioSrc: "/music/romantic.mp3",
    toneFrequency: "lofi-acoustic",
  },
  {
    id: "wedding",
    label: "Shehnai & Vows",
    audioSrc: "/music/wedding.mp3",
    toneFrequency: "shehnai-chords",
  },
  {
    id: "travel",
    label: "Tropical Drift",
    audioSrc: "/music/travel.mp3",
    toneFrequency: "tropical-marimba",
  },
  {
    id: "emotional",
    label: "Forever, Piano",
    audioSrc: "/music/emotional.mp3",
    toneFrequency: "emotional-piano",
  },
];
