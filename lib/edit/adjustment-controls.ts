import type { SliderKey } from "@/lib/validation/edit-state";

export type AdjustmentControl = {
  key: SliderKey;
  label: string;
  min: number;
  max: number;
  unit: string;
  ticks: number;
};

// Order, ranges and tick counts from the handoff's Adjustments table. Ranges must
// match editStateSchema — the schema is what the PATCH route enforces.
export const DEPTH_CONTROLS: AdjustmentControl[] = [
  { key: "intensity", label: "Intensity", min: 0, max: 100, unit: "", ticks: 6 },
  { key: "rotate", label: "Rotate", min: 0, max: 90, unit: "º", ticks: 5 },
  { key: "saturation", label: "Saturation", min: 0, max: 100, unit: "", ticks: 6 },
  { key: "brightness", label: "Brightness", min: 0, max: 100, unit: "", ticks: 6 },
  { key: "contrast", label: "Contrast", min: 0, max: 100, unit: "", ticks: 5 },
  { key: "tint", label: "Tint", min: 0, max: 100, unit: "", ticks: 6 },
  { key: "temperature", label: "Temperature", min: 0, max: 100, unit: "", ticks: 5 },
  { key: "highlight", label: "Highlight", min: 0, max: 100, unit: "", ticks: 5 },
];

export const BORDER_WEIGHT_CONTROL: AdjustmentControl = {
  key: "borderWeight",
  label: "Border weight",
  min: 0,
  max: 10,
  unit: "",
  ticks: 4,
};
