import Hero from "@/components/Hero";
import Chapter from "@/components/Chapter";
import ProgressBar from "@/components/ProgressBar";
import MusicPill from "@/components/MusicPill";
import Headlights from "@/components/Headlights";
import Dimmer from "@/components/Dimmer";
import FoggyGlass from "@/components/FoggyGlass";
import Finale from "@/components/Finale";
import { journey } from "@/data/journey";

export default function Home() {
  return (
    <main className="relative bg-obsidian-0">
      <ProgressBar />
      <MusicPill />
      <Hero />

      {journey.map((chapter, i) => {
        let interactive: React.ReactNode = null;
        if (chapter.interaction === "headlights") {
          interactive = <Headlights image={chapter.images[0]} />;
        } else if (chapter.interaction === "dimmer") {
          interactive = <Dimmer image={chapter.images[0]} />;
        } else if (chapter.interaction === "foggyGlass") {
          interactive = <FoggyGlass image={chapter.images[0]} />;
        } else if (chapter.interaction === "finale") {
          interactive = <Finale />;
        }

        return (
          <Chapter key={chapter.id} chapter={chapter} reverse={i % 2 === 1}>
            {interactive}
          </Chapter>
        );
      })}

      <footer className="relative py-16 text-center">
        <p className="text-champagne/50 text-xs sm:text-sm uppercase tracking-[0.3em] font-light">
          Made with all my love, for you — 8th October
        </p>
      </footer>
    </main>
  );
}
