import { readdir, readFile } from "fs/promises";
import path from "path";

import { GoogleGenAI, Modality } from "@google/genai";
import { z } from "zod";

import { buildStylePrompt } from "./style-prompt";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set");
}

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const STYLE_REFS_DIR = path.join(process.cwd(), "public", "style-refs");

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
  | { outcome: "failed" };

async function pickStyleReference(): Promise<{
  filename: string;
  data: string;
  mimeType: string;
}> {
  const filenames = await readdir(STYLE_REFS_DIR);
  const filename = filenames[Math.floor(Math.random() * filenames.length)];

  if (!filename) {
    throw new Error("No style reference images found in public/style-refs/");
  }

  const mimeType = MIME_TYPES_BY_EXTENSION[path.extname(filename).toLowerCase()];

  if (!mimeType) {
    throw new Error(`Unsupported style reference file type: ${filename}`);
  }

  const buffer = await readFile(path.join(STYLE_REFS_DIR, filename));

  return { filename, data: buffer.toString("base64"), mimeType };
}

export async function generateImage(userPrompt: string): Promise<GenerateImageResult> {
  const styleRef = await pickStyleReference();

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [
      { inlineData: { data: styleRef.data, mimeType: styleRef.mimeType } },
      { text: buildStylePrompt(userPrompt) },
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
