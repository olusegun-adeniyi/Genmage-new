import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Supabase storage credentials are not set");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const BUCKET = "generations";

function extensionForMimeType(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

export async function uploadGenerationImage(
  slug: string,
  base64Data: string,
  mimeType: string,
): Promise<string> {
  const path = `${slug}.${extensionForMimeType(mimeType)}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, Buffer.from(base64Data, "base64"), { contentType: mimeType });

  if (error) {
    throw new Error(`Failed to upload generation image: ${error.message}`);
  }

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
