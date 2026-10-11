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
  const stateClass = comingSoon
    ? "cursor-not-allowed opacity-40"
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
      <span className="relative block h-tile-thumb shrink-0 overflow-hidden rounded-xs bg-foreground-soft">
        {imageSrc && <Image src={imageSrc} alt="" fill sizes="96px" className="object-cover" />}
      </span>
      <span className="flex h-5 min-w-0 items-center px-1 text-background">
        <span className="truncate">{name}</span>
      </span>
    </button>
  );
}
