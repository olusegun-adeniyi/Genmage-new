import Image from "next/image";

type StyleTileProps = {
  name: string;
  imageSrc?: string;
  selected: boolean;
  onSelect?: () => void;
};

export function StyleTile({ name, imageSrc, selected, onSelect }: StyleTileProps) {
  // Focus outline sits at 6px — just outside the 4px selection ring, never on top of it.
  const stateClass = selected ? "opacity-100 shadow-tile-selected" : "opacity-88";

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={name}
      onClick={onSelect}
      className={`relative flex h-15 cursor-pointer flex-col gap-px overflow-hidden rounded-md bg-foreground text-left transition-[opacity,box-shadow] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-foreground ${stateClass}`}
    >
      {/* Artwork sits on the canvas white (white in both themes) so transparent
          thumbnails read cleanly; a style without a thumbnail keeps the dark placeholder. */}
      {/* w-full: Safari 18 doesn't stretch flex children inside a <button>, so the
          contentless thumbnail collapsed to 0px wide and the artwork vanished. */}
      <span
        className={`relative block h-tile-thumb w-full shrink-0 overflow-hidden rounded-xs ${
          imageSrc ? "bg-canvas" : "bg-foreground-soft"
        }`}
      >
        {/* Eager: tiny and always on screen at load — lazy loading only delays them. */}
        {imageSrc && <Image src={imageSrc} alt="" fill sizes="96px" loading="eager" className="object-cover" />}
      </span>
      <span className="flex h-5 w-full min-w-0 items-center px-1 text-background">
        <span className="truncate">{name}</span>
      </span>
    </button>
  );
}
