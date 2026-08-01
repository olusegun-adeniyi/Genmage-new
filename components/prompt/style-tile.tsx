import { Check } from "lucide-react";
import Image from "next/image";

type StyleTileProps = {
  name: string;
  imageSrc: string;
  selected: boolean;
  disabled?: boolean;
  // Gallery-only: forces the hover border look statically for side-by-side
  // documentation. Production call sites never pass this — real hover comes
  // from the hover: class below.
  demoState?: "hover";
  onClick?: () => void;
};

export function StyleTile({ name, imageSrc, selected, disabled, demoState, onClick }: StyleTileProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={`relative flex size-20 flex-col items-center justify-center gap-1.5 rounded-md border p-2 transition-[transform,background-color] duration-150 ease-out active:scale-95 disabled:pointer-events-none disabled:opacity-40 md:size-24 ${
        selected
          ? "border-border bg-muted"
          : `border-border bg-transparent hover:border-border-hover ${demoState === "hover" ? "border-border-hover" : ""}`
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2`}
    >
      {selected && (
        <span
          aria-hidden="true"
          className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-foreground"
        >
          <Check className="size-3 text-background" strokeWidth={3} />
        </span>
      )}
      <span className="block size-12 overflow-hidden rounded-lg">
        <Image src={imageSrc} alt="" width={48} height={48} className="size-full object-cover" />
      </span>
      <span className="text-xs font-medium">{name}</span>
    </button>
  );
}
