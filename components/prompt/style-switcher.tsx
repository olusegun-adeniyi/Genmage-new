import { Check } from "lucide-react";
import Image from "next/image";

type StyleTile = {
  id: string;
  name: string;
};

type StyleSwitcherProps = {
  styles: StyleTile[];
};

export function StyleSwitcher({ styles }: StyleSwitcherProps) {
  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">Select a style</p>
      <div role="radiogroup" aria-label="Style" className="flex gap-3">
        {styles.map((style, index) => {
          const selected = index === 0;

          return (
            <button
              key={style.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`relative flex size-20 flex-col items-center justify-center gap-1.5 rounded-[8px] border p-2 transition-[transform,background-color] duration-150 ease-out active:scale-95 md:size-24 ${
                selected
                  ? "border-border bg-muted"
                  : "border-border bg-transparent hover:border-border-hover"
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
              <span className="block size-12 overflow-hidden rounded-md">
                <Image
                  src="/examples/example_01.png"
                  alt=""
                  width={48}
                  height={48}
                  className="size-full object-cover"
                />
              </span>
              <span className="text-xs font-medium">{style.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
