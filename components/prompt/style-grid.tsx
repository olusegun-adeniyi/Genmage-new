import { StyleTile } from "./style-tile";

export type StyleOption = { id: string; name: string };

const GRID_SIZE = 6;

// Placeholder names fill the grid until more styles ship — unique, so the grid
// never shows a gap or a duplicate. Swap here once styles are decided.
const COMING_SOON_NAMES = ["Line art", "Pixel art", "Collage"];

// Thumbnails are curated artwork in /public, keyed by style id — not user data.
const STYLE_THUMBNAILS: Record<string, string> = {
  watercolor: "/examples/style-tile-watercolor.jpg",
  simple: "/examples/style-tile-simple-oranges.png", // on a near-white backdrop that fills the tile
  doodle: "/examples/style-tile-doodle.jpg",
};

type StyleGridProps = {
  styles: StyleOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function StyleGrid({ styles, selectedId, onSelect }: StyleGridProps) {
  // A placeholder never repeats a style that's already live (e.g. "Simple").
  const liveNames = new Set(styles.map((style) => style.name.toLowerCase()));
  const placeholderCount = Math.max(0, GRID_SIZE - styles.length);
  const placeholders = COMING_SOON_NAMES.filter((name) => !liveNames.has(name.toLowerCase())).slice(0, placeholderCount);

  return (
    <div
      role="radiogroup"
      aria-label="Illustration style"
      // No outline or inset — tiles align with the heading and prompt box edges.
      className="grid grid-cols-3 gap-1.5"
    >
      {styles.map((style) => (
        <StyleTile
          key={style.id}
          name={style.name}
          imageSrc={STYLE_THUMBNAILS[style.id]}
          selected={style.id === selectedId}
          onSelect={() => onSelect(style.id)}
        />
      ))}
      {placeholders.map((name, index) => (
        <StyleTile key={`coming-soon-${index}`} name={name} selected={false} comingSoon />
      ))}
    </div>
  );
}
