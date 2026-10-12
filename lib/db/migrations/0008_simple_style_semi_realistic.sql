-- Simple style: semi-realistic layered shapes (Olusegun, 2026-10-12). Replaces 0007's
-- prompt. Keeps the outline-free, shape-built construction but drops the rules that
-- forced pure geometry and banned texture/realistic detail: shading follows real
-- form, tonal range is richer, highlights match the material, and restrained
-- material detail is allowed. User-requested composition, colours and background win.
UPDATE "style" SET "prompt" = $prompt$Semi-realistic illustration constructed from layered, outline-free colour shapes. Subjects have believable proportions, natural silhouettes and convincing depth, while remaining visibly illustrated rather than photographic.

Construction:
- Build every form from adjacent and overlapping colour shapes. Edges exist only where two colours meet. Do not draw contour lines, black outlines or strokes, and never trace an edge in a darker version of the base colour.
- Shading shapes follow the subject’s actual curves, folds and surfaces — the round of a tomato, the crease of paper, the swell of a bread crust. Avoid arbitrary polygon facets and any low-poly appearance.
- Preserve natural irregularities: shapes can be organic, uneven and hand-cut rather than perfectly geometric.
- Slender elements (stems, handles, cables, straps) are filled shapes with real width, not lines.

Tone and light:
- Use a rich tonal range on each surface: a distinct base colour, one or more midtones, shadows and highlights, each as its own shape.
- Keep most colour transitions crisp and deliberate. Use a subtle soft transition only occasionally, where a surface genuinely turns gradually.
- Light the whole image from one consistent direction. Ground the subject with contact shadows where it touches a surface and cast shadows that fall away from the light.

Materials and detail:
- Match highlights to the material: small, sharp, bright reflections on glossy surfaces (tomato skin, glass, wet sauce); broader, softer-edged highlight shapes on matte surfaces (bread, paper, fabric).
- Include selective surface detail that communicates the material — browned and blistered bread crust, melting cheese, crumpled paper creases, glossy skin, woven fabric — rendered as small layered colour shapes.
- Keep texture restrained and purposeful: enough to read the material, never noise, grain or an overall filter.

People, when requested:
- Believable adult proportions and natural poses, built from the same layered colour shapes. Faces are defined by shifts in tone, not drawn features with outlines.
- Hair and clothing follow their real folds and masses with layered shadow and highlight shapes.
- Include varied skin tones where suitable.

Respect the user:
- Keep the subject exactly as described. Preserve any composition, viewpoint, colours and background the user requests; these style rules govern only how it is rendered.
- When the user gives no colours, use the subject’s natural colours, slightly heightened.

Avoid:
- Cartoon outlines, contour lines, sketch marks and decorative linework.
- Oversimplified clip art, excessive faceting and low-poly geometry.
- Photorealism, airbrushed or gradient shading, 3D-rendered, clay or plastic aesthetics.
- Brand logos, watermarks, signatures and unrequested typography.
- Copying the reference compositions.

The result should look like the same layered, semi-realistic illustration family as the references, whatever the subject: realism comes from accurate form, material-specific highlights and layered tonal shapes.$prompt$ WHERE "id" = 'simple';
