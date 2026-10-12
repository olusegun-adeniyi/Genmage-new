-- Simple style: geometric art direction (Olusegun, 2026-10-12). Replaces 0006's prompt.
-- Leads with his core sentence verbatim, turns his six principles (simplified shapes,
-- flat fills, tonal shading, hard-edged shadows, minimal outlines, selective detail)
-- into construction rules, and keeps 0006's strict lineless rules and people guidance.
UPDATE "style" SET "prompt" = $prompt$Geometric, outline-free illustration built from clean shapes and solid colour planes, with depth defined by contrasting tones, crisp highlights and hard-edged shadows. Simplify details while preserving the subject’s recognisable silhouette and structure.

Construction:
- Simplified shapes: reduce every subject to combinations of rectangles, triangles, circles, arcs and polygons. Buildings, objects and figures should read as assembled geometric pieces.
- Flat colour fills: every shape is one solid colour. No gradients, blur, texture or noise.
- Tonal shading: show form with lighter and darker versions of a colour — planes facing the light are light, planes turned away are darker. Two to four tones per surface is enough.
- Hard-edged shadows: draw cast and form shadows as deliberate shapes with crisp, straight or cleanly curved boundaries, often on strong diagonals. Highlights are equally crisp shapes, never glows.
- Minimal outlines: edges exist only where two colours meet. Do not draw strokes, contour lines, crease lines, hatching or sketch marks, and never trace an edge in black or a darker version of the base colour.
- Selective detail: keep only the features needed to recognise the subject — its silhouette, key structure and a few defining elements. Drop texture, ornament and small clutter.
- Slender elements (cables, handles, railings, glasses) are filled shapes with real width, not lines.

Rendering:
- Crisp, vector-like edges and a graphic, poster-like clarity.
- Build depth through overlapping planes, believable perspective and value contrast rather than lighting effects.
- Avoid soft airbrushing, glossy reflections, realistic lighting and 3D rendering.

People, when requested:
- Build figures from the same flat geometric planes: simplified, slightly elongated adult proportions with clear silhouettes and purposeful poses.
- Faces are minimal — small filled shapes or shifts in shade for eyes, nose and mouth. Hair is a solid graphic mass with one or two tonal shapes.
- Clothing is large colour shapes with a few angular shadow planes for folds.
- Include varied skin tones where suitable. Avoid oversized heads, exaggerated cartoon expressions and rounded blob characters.

Colour:
- A restrained, coordinated palette with strong separation between shapes: usually one dominant hue carried through light, mid and dark tones, plus one or two accents and neutrals.
- Monochromatic or near-monochromatic treatments of the dominant hue are encouraged.
- Respect explicit user colour requests while preserving the flat geometric rendering.

Composition:
- Make the subject immediately readable, with confident framing and generous negative space.
- Use frontal, side, three-quarter or low-angle views that show the subject’s structure clearly.
- Keep standalone subjects fully visible with comfortable margins; cropping is fine for scenes and close-ups.
- Keep backgrounds as large, quiet colour fields or a few simplified shapes.

Exclude:
- Outlines of any weight, contour lines, hatching, sketch marks and decorative linework.
- Gradients, grain, paper texture, watercolour, painterly brushwork, photorealism, 3D, clay or plastic rendering, and intricate detail.
- Brand logos, watermarks, signatures and unrequested typography.
- Copying the reference compositions.

The result should feel like a coherent member of the same geometric illustration family as the references, even when depicting a completely different subject.$prompt$ WHERE "id" = 'simple';
