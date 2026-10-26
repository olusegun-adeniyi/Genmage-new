import { StyleTile } from "./style-tile";

export type StyleOption = { id: string; name: string };

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
    </div>
  );
}
