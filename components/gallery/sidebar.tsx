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
      { id: "components-style-tile", label: "Style tile" },
      { id: "components-generate", label: "Prompt box & recent list" },
      { id: "components-buttons", label: "Buttons" },
      { id: "components-action-bar", label: "Canvas action bar" },
      { id: "components-slider", label: "Slider & colour row" },
      { id: "components-toast", label: "Toast notification" },
    ],
  },
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
      {/* Desktop: sticky nested tree. */}
      <nav
        aria-label="Design system sections"
        className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-1 overflow-y-auto border-r border-border bg-background px-5 py-8 md:flex"
      >
        <p className="mb-4 text-foreground-strong">genmage · design system</p>
        {NAV.map((group) => (
          <div key={group.id} className="mb-3">
            <a
              href={`#${group.id}`}
              className={`block rounded-sm px-2 py-1 text-sm transition-colors duration-150 ease-out ${
                isGroupActive(group, activeId)
                  ? "text-foreground-strong"
                  : "text-muted-foreground hover:text-foreground-strong"
              }`}
            >
              {group.label}
            </a>
            {group.children && (
              <div className="mt-1 ml-2 flex flex-col gap-0.5 border-l border-border pl-3">
                {group.children.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`rounded-sm px-2 py-1 text-xs transition-colors duration-150 ease-out ${
                      activeId === item.id
                        ? "text-foreground-strong"
                        : "text-muted-foreground hover:text-foreground-strong"
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
        className="sticky top-0 z-10 flex gap-2 overflow-x-auto border-b border-border bg-background px-4 py-3 md:hidden"
      >
        {NAV.map((group) => (
          <a
            key={group.id}
            href={`#${group.id}`}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition-colors duration-150 ease-out ${
              isGroupActive(group, activeId)
                ? "border-tick text-foreground-strong"
                : "border-border text-muted-foreground"
            }`}
          >
            {group.label}
          </a>
        ))}
      </nav>
    </>
  );
}
