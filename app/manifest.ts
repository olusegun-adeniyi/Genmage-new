import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Genmage",
    short_name: "Genmage",
    description: "A style-locked illustration generator.",
    start_url: "/",
    display: "standalone",
    theme_color: "#fafaf9",
    background_color: "#fafaf9",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
