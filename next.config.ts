import type { NextConfig } from "next";

// Generated images are served from Supabase Storage's public bucket URL — derived
// from the same env var lib/storage/upload-image.ts already uses, not hardcoded.
const supabaseHostname = process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).hostname : undefined;

const nextConfig: NextConfig = {
  // Native (Rust) binding — load it from node_modules at runtime, don't bundle it.
  serverExternalPackages: ["@neplex/vectorizer"],
  images: {
    remotePatterns: supabaseHostname
      ? [{ protocol: "https", hostname: supabaseHostname, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
};

export default nextConfig;
