-- Simple style: strictly lineless (Olusegun, 2026-10-12). Replaces 0005's prompt:
-- adds the lineless construction rule verbatim near the top, removes the
-- "occasional fine lines" permission, widens the outline exclusion to any weight,
-- and rewords "contour changes" (hair) so it can't be read as a stroke.
UPDATE "style" SET "prompt" = $prompt$Create a polished flat editorial illustration matching the visual language of the supplied references.

Lineless construction (strict — overrides anything in the references):
- Construct the entire illustration from solid filled colour shapes. Define silhouettes through the edges of those shapes, without adding strokes around them. Emphasise details, depth, folds, and features through adjacent lighter and darker colour areas.
- Use broad, hard-edged shadow shapes: a darker skin-colour patch defines a nose or hand; a darker fabric-colour area defines a clothing fold; contrasting colour planes define an object’s front and side.
- Do not draw outlines, contour lines, crease lines, hatching, sketch marks, or decorative linework. Do not trace edges in black or a darker version of the base colour.
- For slender physical elements such as bag handles or glasses, depict the element itself as a filled shape with real width. Do not use it as an excuse to outline surrounding objects.
- Keep shading flat and intentional, with a small number of distinct tonal areas. Avoid gradients, blur, texture, and realistic lighting.
- The result must read as an illustration built from cut colour shapes, with details revealed by changes in shade.

Shape and rendering:
- Use crisp, clean, vector-like shapes with smooth edges and solid colour fills.
- Combine simplified geometric construction with natural organic curves.
- Define every form through adjacent colour shapes and contrasting shades — never with outlines.
- Build depth through overlap, believable perspective, and a small number of distinct colour planes.
- Render shading as broad, hard-edged darker shapes. Avoid soft airbrushing, glossy highlights, and realistic lighting.

People, when requested:
- Use believable adult proportions, slightly simplified and elongated where appropriate.
- Give characters natural gestures, purposeful poses, and clearly readable silhouettes.
- Simplify faces with minimal eyes, eyebrows, noses, and mouths, each formed by a small filled shape or a shift in shade. Keep expressions understated.
- Render hair as solid graphic masses, with a few shifts in shape and shade.
- Render clothing as large colour shapes with only a few angular shadow shapes suggesting folds.
- Include varied skin tones and appearances where suitable for the subject.
- Avoid oversized heads, tiny bodies, exaggerated cartoon expressions, and generic rounded blob characters.

Objects and environments:
- Preserve the essential silhouette and recognisable functional details of each object, shown through filled shapes and shade changes.
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
- Outlines of any weight, contour lines, crease lines, hatching, sketch marks, and decorative linework.
- 3D rendering, clay, plush, plastic, photorealism, watercolour, pencil sketching, grain, paper texture, painterly brushwork, intricate detail, dramatic lighting, and decorative gradients.
- Brand logos, watermarks, signatures, and unrequested typography.
- Copying the reference compositions or inserting Uber branding.

The result should feel like a coherent member of the same illustration family as the references, even when depicting a completely different subject.$prompt$ WHERE "id" = 'simple';
