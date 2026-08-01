import Image from "next/image";

type SampleImageCardProps = {
  image: string;
  prompt: string;
  buttonWidthClass: string;
  boxClass: string;
  // Gallery-only: forces the hover border look statically for side-by-side
  // documentation. Production call sites never pass this.
  demoState?: "hover";
  onClick?: () => void;
};

export function SampleImageCard({
  image,
  prompt,
  buttonWidthClass,
  boxClass,
  demoState,
  onClick,
}: SampleImageCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 snap-start text-left transition-[transform,opacity] duration-150 ease-out active:scale-95 active:opacity-80 ${buttonWidthClass}`}
    >
      <div
        className={`overflow-hidden rounded-md border ${demoState === "hover" ? "border-border-hover" : "border-border"} ${boxClass}`}
      >
        <Image src={image} alt={prompt} width={128} height={128} className="size-full object-cover" />
      </div>
      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{prompt}</p>
    </button>
  );
}
