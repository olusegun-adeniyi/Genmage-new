"use client"; // scroll arrows need a ref + click handlers to move the scroll position

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

import { EXAMPLES } from "@/config/examples";

type SampleImagesRowProps = {
  size: "desktop" | "mobile";
};

// Tailwind's scanner needs complete literal class names, not string-concatenated
// ones — so each size variant is spelled out in full here rather than built from a prop.
const THUMB_CLASSES = {
  desktop: { button: "w-24", box: "size-24" },
  mobile: { button: "w-32", box: "size-32" },
};

const SCROLL_AMOUNT_PX = 200;

export function SampleImagesRow({ size }: SampleImagesRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { button: buttonWidthClass, box: boxClass } = THUMB_CLASSES[size];

  function scrollBy(amount: number) {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Sample images</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-SCROLL_AMOUNT_PX)}
            aria-label="Scroll sample images left"
            className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-[transform,opacity] duration-150 ease-out active:scale-95 active:opacity-80"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(SCROLL_AMOUNT_PX)}
            aria-label="Scroll sample images right"
            className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-[transform,opacity] duration-150 ease-out active:scale-95 active:opacity-80"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x items-start gap-3 overflow-x-auto"
      >
        {EXAMPLES.map((example) => (
          <button
            key={example.image}
            type="button"
            className={`shrink-0 snap-start text-left transition-[transform,opacity] duration-150 ease-out active:scale-95 active:opacity-80 ${buttonWidthClass}`}
          >
            <div className={`overflow-hidden rounded-[8px] border border-border ${boxClass}`}>
              <Image
                src={example.image}
                alt={example.prompt}
                width={128}
                height={128}
                className="size-full object-cover"
              />
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{example.prompt}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
