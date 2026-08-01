"use client"; // scroll arrows need a ref + click handlers to move the scroll position

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { EXAMPLES } from "@/config/examples";

import { SampleImageCard } from "./sample-image-card";

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
          <Button variant="icon" onClick={() => scrollBy(-SCROLL_AMOUNT_PX)} aria-label="Scroll sample images left">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="icon" onClick={() => scrollBy(SCROLL_AMOUNT_PX)} aria-label="Scroll sample images right">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <div ref={scrollRef} className="scrollbar-hide flex snap-x items-start gap-3 overflow-x-auto">
        {EXAMPLES.map((example) => (
          <SampleImageCard
            key={example.image}
            image={example.image}
            prompt={example.prompt}
            buttonWidthClass={buttonWidthClass}
            boxClass={boxClass}
          />
        ))}
      </div>
    </div>
  );
}
