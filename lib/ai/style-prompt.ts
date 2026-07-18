export const LOCKED_STYLE_PROMPT =
  "The illustration style is a loose hand-painted watercolor food sketch with soft transparent washes, organic ink-like outlines, warm natural colors, expressive brush textures, subtle color bleeding, and a light blue-grey shadow on a clean white background.";

export function buildStylePrompt(userPrompt: string): string {
  return `${LOCKED_STYLE_PROMPT}\n\nSubject: ${userPrompt}\n\nMatch the illustration style of the reference image exactly. 1024x1024 square composition, centered.`;
}
