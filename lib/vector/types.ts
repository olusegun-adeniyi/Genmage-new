// The editable vector form of a flat-style illustration. Shapes are in paint
// order (later shapes draw on top). Each keeps its exact traced fill and belongs
// to one palette group: the group is how shapes are selected and recoloured
// together (a recolour shifts every member by the same amount, so the style's
// base/shadow shading survives), never a colour they're snapped to.

export type PaletteGroup = {
  id: string; // "g1", "g2", …
  hex: string; // #rrggbb, lowercase — the group's representative (largest) colour
};

export type VectorShape = {
  id: string; // "s1", "s2", … — stable across edits
  groupId: string;
  fill: string; // #rrggbb, lowercase — the shape's own colour
  d: string; // path data, relative to (x, y)
  x: number;
  y: number;
};

// A traced outline: path data relative to (x, y).
export type VectorOutline = {
  d: string;
  x: number;
  y: number;
};

export type VectorDocument = {
  width: number;
  height: number;
  // The subject's silhouette (even-odd, so gaps are holes). Shapes are traced
  // stacked — no internal gaps — and clipped to this, which is what makes the
  // background see-through. Null for full-bleed images with no paper margin.
  silhouette: VectorOutline[] | null;
  palette: PaletteGroup[];
  shapes: VectorShape[];
};
