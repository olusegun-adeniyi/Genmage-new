"use client"; // gallery demos hold their own state so every control is genuinely interactive

import { useState } from "react";

import { ActionBar } from "@/components/canvas/action-bar";
import { RecentList } from "@/components/history/recent-list";
import { PromptBox } from "@/components/prompt/prompt-box";
import { StyleGrid } from "@/components/prompt/style-grid";
import { ColourRow } from "@/components/ui/colour-row";
import { SliderRow } from "@/components/ui/slider-row";
import { BORDER_WEIGHT_CONTROL, DEPTH_CONTROLS } from "@/lib/edit/adjustment-controls";
import type { HistoryItem } from "@/lib/hooks/use-history";
import { DEFAULT_EDIT_STATE, type AspectRatio } from "@/lib/validation/edit-state";

const DEMO_STYLES = [{ id: "watercolor", name: "Watercolor" }];

export function StyleGridDemo() {
  const [selected, setSelected] = useState("watercolor");
  return <StyleGrid styles={DEMO_STYLES} selectedId={selected} onSelect={setSelected} />;
}

export function PromptBoxDemo({ initial = "", generating = false }: { initial?: string; generating?: boolean }) {
  const [value, setValue] = useState(initial);
  return <PromptBox value={value} onValueChange={setValue} onGenerate={() => undefined} isGenerating={generating} />;
}

export function SliderDemo({ disabled = false }: { disabled?: boolean }) {
  // The handoff's demo values — not the product defaults — so the fill states vary.
  const [values, setValues] = useState<Record<string, number>>({ intensity: 10, rotate: 30, saturation: 36, borderWeight: 0 });
  return (
    <div className="flex flex-col gap-6">
      {[DEPTH_CONTROLS[0], DEPTH_CONTROLS[1], DEPTH_CONTROLS[2], BORDER_WEIGHT_CONTROL].map((control) => (
        <SliderRow
          key={control.key}
          label={control.label}
          value={values[control.key]}
          min={control.min}
          max={control.max}
          unit={control.unit}
          ticks={control.ticks}
          disabled={disabled}
          onChange={(value) => setValues((current) => ({ ...current, [control.key]: value }))}
        />
      ))}
    </div>
  );
}

export function ColourRowDemo() {
  const [border, setBorder] = useState(DEFAULT_EDIT_STATE.borderColor);
  const [background, setBackground] = useState(DEFAULT_EDIT_STATE.backgroundColor);
  return (
    <div className="flex flex-col gap-6">
      <ColourRow label="Border colour" value={border} onChange={setBorder} />
      <ColourRow label="Background colour" value={background} onChange={setBackground} />
    </div>
  );
}

const DEMO_HISTORY: HistoryItem[] = [
  "A foggy morning in a scottish farm",
  "A quiet cup of matcha on a rainy morning",
  "An old man reading by a window",
].map((prompt, index) => ({
  slug: `demo-${index}`,
  imageUrl: "/examples/style-tile-watercolor.jpg",
  prompt,
  style: "watercolor",
  editState: DEFAULT_EDIT_STATE,
  createdAt: new Date(0).toISOString(),
}));

export function RecentListDemo() {
  const [items, setItems] = useState(DEMO_HISTORY);
  const [active, setActive] = useState<string | null>("demo-0");
  return (
    <div className="flex h-56 flex-col">
      <RecentList
        items={items}
        styleNames={{ watercolor: "Watercolor" }}
        activeSlug={active}
        onSelect={(item) => setActive(item.slug)}
        onEdit={(item) => setActive(item.slug)}
        onRemove={(item) => setItems((current) => current.filter((entry) => entry.slug !== item.slug))}
      />
    </div>
  );
}

export function ActionBarDemo({ hasGeneration }: { hasGeneration: boolean }) {
  const [aspect, setAspect] = useState<AspectRatio>("1:1");
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative h-80 overflow-hidden rounded-2xl border border-border bg-canvas">
      <ActionBar
        hasGeneration={hasGeneration}
        aspectRatio={aspect}
        onAspectChange={setAspect}
        shareCopied={copied}
        onShare={() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        onExport={() => undefined}
      />
    </div>
  );
}
