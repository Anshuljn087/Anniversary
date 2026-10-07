import Hero from "@/components/Hero";
import Chapter from "@/components/Chapter";
import ProgressBar from "@/components/ProgressBar";
import DynamicAudioManager from "@/components/audio/DynamicAudioManager";
import BirthdayChapter from "@/components/BirthdayChapter";
import Finale from "@/components/Finale";
import { journey } from "@/data/journey";

export default function Home() {
  return (
    <main className="relative bg-obsidian-0">
      <ProgressBar />
      <DynamicAudioManager />
      <Hero />

      {journey.map((chapter, i) => {
        if (chapter.id === "special-memories") {
          return <BirthdayChapter key={chapter.id} chapter={chapter} />;
        }
        if (chapter.id === "grand-finale") {
          return <Finale key={chapter.id} chapter={chapter} />;
        }
        return <Chapter key={chapter.id} chapter={chapter} reverse={i % 2 === 1} />;
      })}

      <footer className="relative py-16 text-center">
        <p className="text-champagne/50 text-xs sm:text-sm uppercase tracking-[0.3em] font-light">
          Made with all my love, for you — 8th October
        </p>
      </footer>
    </main>
  );
}
