-- Doodle style: Olusegun's art direction (2026-10-12), seeded active —
-- public/style-refs/doodle/ already holds its three references. Independent of
-- the outline-free styles: none of Simple's rules apply here.
INSERT INTO "style" ("id", "name", "prompt", "active", "example_image_url") VALUES ('doodle', 'Doodle', $prompt$Create a playful hand-drawn pen doodle with a recognisable, simplified silhouette. Use black ink outlines with gently irregular curves, subtle asymmetry and rounded stroke ends. The drawing should feel casually drawn by hand while remaining clear and intentional.

Line:
- Moderately bold outer contours, with slightly thinner lines for internal details.
- Keep line thickness mostly consistent, with subtle natural variation.
- Lines are confident single strokes — no repeated sketch lines, wobble for its own sake, or mechanical, perfectly geometric curves.

Detail and texture:
- Use economical details: short strokes, dots, dashes, simple patterns and a few contour marks.
- Suggest texture or depth with sparse short hatching and occasional solid black areas.
- Leave most enclosed areas unfilled, so the background shows through.

Form:
- Simplified proportions and a relaxed, playful character.
- Keep the subject immediately recognisable.

Subject and composition:
- Draw only the requested subject or composition. The reference sheets demonstrate the drawing style, not how many objects to include or how to arrange them.
- Preserve the user’s requested subject, composition and any explicit colour or background choices.
- Use a plain white background by default, unless the user requests another background or transparency.

Avoid:
- Colour fills, unless the user asks for colour.
- Gradients, soft shadows or realistic lighting.
- 3D forms or photorealistic textures.
- Perfectly geometric, mechanical-looking outlines.
- Excessive scribbling, repeated sketch lines or dense crosshatching.
- Faces, limbs, lettering, logos or decorative symbols, unless requested.
- Sticker borders or die-cut effects, unless requested.$prompt$, true, NULL);
