import { StyleTile } from "./style-tile";

export type StyleOption = { id: string; name: string };

const GRID_SIZE = 6;

// Placeholder names straight from the handoff (which itself flags the second
// row's duplicates as needing real names). Swap here once styles are decided.
const COMING_SOON_NAMES = ["Simple", "Doodle", "Line art", "Simple", "Doodle"];

// Thumbnails are curated artwork in /public, keyed by style id — not user data.
const STYLE_THUMBNAILS: Record<string, string> = {
  watercolor: "/examples/style-tile-watercolor.jpg",
};

type StyleGridProps = {
  styles: StyleOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function StyleGrid({ styles, selectedId, onSelect }: StyleGridProps) {
  const placeholderCount = Math.max(0, GRID_SIZE - styles.length);
  const placeholders = COMING_SOON_NAMES.slice(0, placeholderCount);

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
