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

function buildPrompt(stylePrompt: string, userPrompt: string): string {
  return `${stylePrompt}\n\nSubject: ${userPrompt}\n\nMatch the illustration style of the reference image exactly. 1024x1024 square composition, centered.`;
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
    config: { responseModalities: [Modality.IMAGE] },
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
