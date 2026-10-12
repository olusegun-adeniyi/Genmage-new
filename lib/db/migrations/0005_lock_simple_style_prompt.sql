-- Simple style: replaces the 0004 draft with Olusegun's fixed art direction
-- (2026-10-12) and goes live now that public/style-refs/simple/ holds its five
-- reference illustrations. Dollar-quoted so the prompt's punctuation needs no escaping.
UPDATE "style" SET "active" = true, "prompt" = $prompt$Create a polished flat editorial illustration matching the visual language of the supplied references.

Shape and rendering:
- Use crisp, clean, vector-like shapes with smooth contours and solid colour fills.
- Combine simplified geometric construction with natural organic curves.
- Define forms primarily through adjacent colour shapes, without outlines around every object.
- Use occasional fine lines only for functional details such as bag handles, glasses, cables, or small object features.
- Build depth through overlap, believable perspective, and a small number of distinct colour planes.
- Render shading as broad, hard-edged darker shapes. Avoid soft airbrushing, glossy highlights, and realistic lighting.

People, when requested:
- Use believable adult proportions, slightly simplified and elongated where appropriate.
- Give characters natural gestures, purposeful poses, and clearly readable silhouettes.
- Simplify faces with minimal eyes, eyebrows, noses, and mouths. Keep expressions understated.
- Render hair as solid graphic masses with a few contour changes.
- Render clothing as large colour shapes with only a few angular shadow shapes suggesting folds.
- Include varied skin tones and appearances where suitable for the subject.
- Avoid oversized heads, tiny bodies, exaggerated cartoon expressions, and generic rounded blob characters.

Objects and environments:
- Preserve the essential silhouette and recognisable functional details of each object.
- Use simplified but credible proportions and perspective.
- Show volume with two or three flat colour planes where necessary.
- Reduce background architecture and scenery to large, quiet shapes.
- Do not add people, phones, vehicles, or business imagery unless the user’s subject calls for them.

Colour:
- Use a restrained, coordinated palette with strong separation between shapes.
- Draw from cobalt blue, deep navy, forest green, black, charcoal, white, pale grey, blush pink, peach, and warm brown.
- Usually choose one dominant accent colour, supported by neutrals and a few secondary colours.
- Use lighter tints for background areas and darker related colours for shadow planes.
- Treat skin tones separately from the main palette.
- Respect explicit user colour requests while preserving the flat rendering style.

Composition:
- Make the requested subject or action immediately readable.
- Use confident framing and generous negative space.
- Use natural frontal, side, or three-quarter views depending on the subject.
- Cropping is appropriate for scenes and close-ups. Keep standalone assets fully visible with comfortable margins.
- Keep supporting details subordinate to the main subject.
- Default to a white or restrained pale background unless the user requests a scene or transparent background.

Exclude:
- 3D rendering, clay, plush, plastic, photorealism, watercolour, pencil sketching, grain, paper texture, painterly brushwork, heavy outlines, intricate detail, dramatic lighting, and decorative gradients.
- Brand logos, watermarks, signatures, and unrequested typography.
- Copying the reference compositions or inserting Uber branding.

The result should feel like a coherent member of the same illustration family as the references, even when depicting a completely different subject.$prompt$ WHERE "id" = 'simple';
