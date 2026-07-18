import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "generations";

let supabase: SupabaseClient | null = null;

// Lazy init: reading Supabase credentials at module scope would throw during
// Next.js's build-time page data collection, before real env vars are available.
function getSupabase(): SupabaseClient {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase storage credentials are not set");
  }

  if (!supabase) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  }

  return supabase;
}

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
  const { error } = await getSupabase()
    .storage.from(BUCKET)
    .upload(path, Buffer.from(base64Data, "base64"), { contentType: mimeType });

  if (error) {
    throw new Error(`Failed to upload generation image: ${error.message}`);
  }

  return getSupabase().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
