"use client"; // highlights the current section on scroll via IntersectionObserver

import { useEffect, useState } from "react";

type NavItem = { id: string; label: string };
type NavGroup = { id: string; label: string; children?: NavItem[] };

const NAV: NavGroup[] = [
  { id: "overview", label: "Overview" },
  {
    id: "tokens",
    label: "Tokens",
    children: [
      { id: "tokens-colors", label: "Colors" },
      { id: "tokens-radii", label: "Radii" },
      { id: "tokens-spacing", label: "Spacing" },
      { id: "tokens-typography", label: "Typography" },
      { id: "tokens-motion", label: "Motion" },
    ],
  },
  {
    id: "components",
    label: "Components",
    children: [
      { id: "components-wordmark", label: "Wordmark" },
      { id: "components-style-tile", label: "Style tile" },
      { id: "components-sample-card", label: "Sample image card" },
      { id: "components-prompt-input", label: "Prompt input" },
      { id: "components-buttons", label: "Buttons" },
      { id: "components-canvas", label: "Canvas" },
      { id: "components-slider", label: "Slider" },
      { id: "components-swatch-picker", label: "Color swatch picker" },
      { id: "components-history-entry", label: "History log entry" },
      { id: "components-toast", label: "Toast notification" },
      { id: "components-panels", label: "Panels" },
    ],
  },
  { id: "layout-patterns", label: "Layout patterns" },
  { id: "rules", label: "Rules" },
];

const ALL_IDS = NAV.flatMap((group) => [group.id, ...(group.children?.map((c) => c.id) ?? [])]);

function useActiveSection() {
  const [activeId, setActiveId] = useState<string>("overview");

  useEffect(() => {
    const elements = ALL_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-10% 0px -70% 0px" },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return activeId;
}

function isGroupActive(group: NavGroup, activeId: string) {
  return group.id === activeId || (group.children?.some((c) => c.id === activeId) ?? false);
}

export function GallerySidebar() {
  const activeId = useActiveSection();

  return (
    <>
      {/* Desktop: sticky nested tree, dark surface — the only place in the product
          today that actually renders the still-unbuilt dark controls-panel tokens. */}
      <nav
        aria-label="Design system sections"
        className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-1 overflow-y-auto border-r border-border-on-dark bg-surface-dark px-5 py-8 md:flex"
      >
        <p className="mb-4 text-sm font-medium tracking-tight text-foreground-on-dark">genmage · design system</p>
        {NAV.map((group) => (
          <div key={group.id} className="mb-3">
            <a
              href={`#${group.id}`}
              className={`block rounded-sm px-2 py-1 text-sm transition-colors duration-150 ease-out ${
                isGroupActive(group, activeId)
                  ? "text-foreground-on-dark"
                  : "text-muted-foreground-on-dark hover:text-foreground-on-dark"
              }`}
            >
              {group.label}
            </a>
            {group.children && (
              <div className="mt-1 ml-2 flex flex-col gap-0.5 border-l border-border-on-dark pl-3">
                {group.children.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`rounded-sm px-2 py-1 text-xs transition-colors duration-150 ease-out ${
                      activeId === item.id
                        ? "text-foreground-on-dark"
                        : "text-muted-foreground-on-dark hover:text-foreground-on-dark"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile: top-level sections only, horizontal scroll — sub-items are reachable
          by scrolling the page itself, not worth a second navigation layer at this width. */}
      <nav
        aria-label="Design system sections"
        className="scrollbar-hide sticky top-0 z-10 flex gap-2 overflow-x-auto border-b border-border-on-dark bg-surface-dark px-4 py-3 md:hidden"
      >
        {NAV.map((group) => (
          <a
            key={group.id}
            href={`#${group.id}`}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition-colors duration-150 ease-out ${
              isGroupActive(group, activeId)
                ? "border-border-on-dark-hover text-foreground-on-dark"
                : "border-border-on-dark text-muted-foreground-on-dark"
            }`}
          >
            {group.label}
          </a>
        ))}
      </nav>
    </>
  );
}
