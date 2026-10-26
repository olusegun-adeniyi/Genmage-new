import { z } from "zod";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/);

export const ASPECT_RATIOS = ["1:1", "3:4", "4:3", "16:9"] as const;
export type AspectRatio = (typeof ASPECT_RATIOS)[number];

export const ASPECT_LABELS: Record<AspectRatio, string> = {
  "1:1": "Square 1:1",
  "3:4": "Portrait 3:4",
  "4:3": "Landscape 4:3",
  "16:9": "Wide 16:9",
};

// width ÷ height — what CSS aspect-ratio and the fit math in lib/edit want.
export const ASPECT_VALUES: Record<AspectRatio, number> = {
  "1:1": 1,
  "3:4": 3 / 4,
  "4:3": 4 / 3,
  "16:9": 16 / 9,
};

const percent = z.number().int().min(0).max(100);

export const editStateSchema = z.object({
  intensity: percent,
  rotate: z.number().int().min(0).max(90),
  saturation: percent,
  brightness: percent,
  contrast: percent,
  tint: percent,
  temperature: percent,
  highlight: percent,
  borderWeight: z.number().int().min(0).max(10),
  borderColor: hexColor,
  // null = no background: nothing is painted behind the illustration.
  backgroundColor: hexColor.nullable(),
  aspectRatio: z.enum(ASPECT_RATIOS),
  // Die-cut sticker outline around the illustration's silhouette. Defaults so
  // edit states saved before it existed still parse instead of resetting.
  wrapOutline: z.boolean().default(false),
});

export type EditState = z.infer<typeof editStateSchema>;
export type SliderKey = Exclude<keyof EditState, "borderColor" | "backgroundColor" | "aspectRatio" | "wrapOutline">;

// Defaults are the identity edit — a fresh generation renders exactly as Gemini
// returned it. The handoff's demo values (Rotate 30, Saturation 36, Intensity 10)
// would visibly alter every new image, so they're not used. Saturation's
// identity sits at 50 so it can go both ways: 0 is full black-and-white.
export const DEFAULT_EDIT_STATE: EditState = {
  intensity: 100,
  rotate: 0,
  saturation: 50,
  brightness: 0,
  contrast: 0,
  tint: 0,
  temperature: 0,
  highlight: 0,
  borderWeight: 0,
  borderColor: "#ffae00",
  backgroundColor: null,
  aspectRatio: "1:1",
  wrapOutline: false,
};

// History written before this shape existed (six-lever edit state) fails the
// schema — those entries fall back to defaults rather than being reinterpreted
// on the new, differently-scaled ranges.
export function normalizeEditState(value: unknown): EditState {
  const parsed = editStateSchema.safeParse(value);
  return parsed.success ? parsed.data : DEFAULT_EDIT_STATE;
}
