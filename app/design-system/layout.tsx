import type { Metadata } from "next";
import type { ReactNode } from "react";

import { GallerySidebar } from "@/components/gallery/sidebar";

// Dev-facing reference page — not part of the product, must never turn up in search.
export const metadata: Metadata = {
  title: "Genmage — Design System",
  robots: { index: false, follow: false },
};

export default function DesignSystemLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <GallerySidebar />
      <main className="flex-1 bg-dot-grid px-4 py-10 md:px-10 md:py-12">{children}</main>
    </div>
  );
}
