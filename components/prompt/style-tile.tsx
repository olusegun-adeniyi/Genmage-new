import Image from "next/image";

type StyleTileProps = {
  name: string;
  imageSrc?: string;
  selected: boolean;
  comingSoon?: boolean;
  onSelect?: () => void;
};

export function StyleTile({ name, imageSrc, selected, comingSoon = false, onSelect }: StyleTileProps) {
  // Focus outline sits at 6px — just outside the 4px selection ring, never on top of it.
  // Coming-soon tiles stay focusable (aria-disabled, not disabled) so screen
  // reader and keyboard users still discover that more styles are on the way.
  // Coming-soon tiles stay at full opacity so the overlay label keeps its contrast;
  // the wash over the thumbnail and the dimmed caption do the receding instead.
  const stateClass = comingSoon
    ? "cursor-not-allowed"
    : selected
      ? "cursor-pointer opacity-100 shadow-tile-selected"
      : "cursor-pointer opacity-88";

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={comingSoon || undefined}
      aria-label={comingSoon ? `${name}, coming soon` : name}
      title={comingSoon ? "Coming soon" : undefined}
      onClick={comingSoon ? undefined : onSelect}
      className={`relative flex h-15 flex-col gap-px overflow-hidden rounded-md bg-foreground text-left transition-[opacity,box-shadow] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-foreground ${stateClass}`}
    >
      {/* Artwork sits on the canvas white (white in both themes) so transparent
          thumbnails read cleanly; empty coming-soon slots keep the dark placeholder. */}
      <span
        className={`relative block h-tile-thumb shrink-0 overflow-hidden rounded-xs ${
          imageSrc ? "bg-canvas" : "bg-foreground-soft"
        }`}
      >
        {imageSrc && <Image src={imageSrc} alt="" fill sizes="96px" className="object-cover" />}
        {/* aria-hidden: the button's aria-label already says "coming soon". */}
        {comingSoon && (
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-background/70 px-1 text-center text-foreground"
          >
            Coming soon
          </span>
        )}
      </span>
      <span className={`flex h-5 min-w-0 items-center px-1 text-background ${comingSoon ? "opacity-60" : ""}`}>
        <span className="truncate">{name}</span>
      </span>
    </button>
  );
}
