import { readdir, readFile } from "fs/promises";
import path from "path";

import { GoogleGenAI, Modality } from "@google/genai";
import { z } from "zod";

import { getActiveStyle } from "@/lib/db/queries/styles";

const STYLE_REFS_ROOT = path.join(process.cwd(), "public", "style-refs");

const MIME_TYPES_BY_EXTENSION: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

const generatedImageSchema = z.object({
  data: z.string(),
  mimeType: z.string(),
});

export type GeneratedImage = z.infer<typeof generatedImageSchema>;

export type GenerateImageResult =
  | { outcome: "success"; image: GeneratedImage; styleReference: string }
  | { outcome: "refused" }
  | { outcome: "failed" }
  | { outcome: "invalid_style" };

let client: GoogleGenAI | null = null;

// Lazy init: reading GEMINI_API_KEY at module scope would throw during Next.js's
// build-time page data collection, before real env vars are available.
function getClient(): GoogleGenAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  return client;
}

// The image model takes a single prompt, so the parts are labelled sections: the
// style's locked prompt (from the style table) says HOW to draw, the user's text
// says WHAT to draw, and the output requirements are the app's own constraints.
// The reference line stops the model copying the reference's subject or layout.
// Square on purpose: aspect ratio is a non-destructive crop applied afterwards
// (edit state), and plain white is what the in-browser paper removal turns into
// real transparency — Gemini can't emit an alpha channel itself.
function buildPrompt(stylePrompt: string, userPrompt: string): string {
  return [
    `STYLE\n${stylePrompt}`,
    "REFERENCE\nThe attached image shows the target illustration style. Transfer its visual treatment — shapes, rendering, colour handling and level of detail — not its subject, characters or layout.",
    `SUBJECT\n${userPrompt}`,
    [
      "OUTPUT REQUIREMENTS",
      "- One square 1024x1024 illustration of the subject above.",
      "- Plain white background unless the subject describes a scene or setting. If a transparent background is requested, use plain white; never draw a checkerboard.",
      "- No text, logos, watermarks or signatures unless the subject asks for text.",
    ].join("\n"),
  ].join("\n\n");
}

async function pickStyleReference(styleId: string): Promise<{
  filename: string;
  data: string;
  mimeType: string;
}> {
  const refsDir = path.join(STYLE_REFS_ROOT, styleId);
  const filenames = await readdir(refsDir);
  const filename = filenames[Math.floor(Math.random() * filenames.length)];

  if (!filename) {
    throw new Error(`No style reference images found in public/style-refs/${styleId}/`);
  }

  const mimeType = MIME_TYPES_BY_EXTENSION[path.extname(filename).toLowerCase()];

  if (!mimeType) {
    throw new Error(`Unsupported style reference file type: ${filename}`);
  }

  const buffer = await readFile(path.join(refsDir, filename));

  return { filename, data: buffer.toString("base64"), mimeType };
}

export async function generateImage(
  userPrompt: string,
  styleId: string,
): Promise<GenerateImageResult> {
  const activeStyle = await getActiveStyle(styleId);

  if (!activeStyle) {
    return { outcome: "invalid_style" };
  }

  const styleRef = await pickStyleReference(styleId);

  const response = await getClient().models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [
      { inlineData: { data: styleRef.data, mimeType: styleRef.mimeType } },
      { text: buildPrompt(activeStyle.prompt, userPrompt) },
    ],
    // Pin the output square: left alone, the model copies the reference image's
    // shape (Simple's references are landscape → 1696×608 outputs that the
    // square canvas then crops). Aspect ratio is a post-generation crop here.
    config: { responseModalities: [Modality.IMAGE], imageConfig: { aspectRatio: "1:1" } },
  });

  if (response.promptFeedback?.blockReason) {
    return { outcome: "refused" };
  }

  const imagePart = response.candidates?.[0]?.content?.parts?.find(
    (part) => part.inlineData,
  );

  if (!imagePart?.inlineData) {
    return { outcome: "failed" };
  }

  return {
    outcome: "success",
    image: generatedImageSchema.parse(imagePart.inlineData),
    styleReference: styleRef.filename,
  };
}
