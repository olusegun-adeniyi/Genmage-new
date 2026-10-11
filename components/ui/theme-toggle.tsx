"use client"; // reads and switches the persisted colour theme

import { MoonIcon, SunIcon } from "@/components/ui/icons";
import { useTheme, type Theme } from "@/lib/hooks/use-theme";

const OPTIONS: { value: Theme; label: string; Icon: typeof SunIcon }[] = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
];

// 40px pill: 1px border + 4px padding around two 30px options with a 2px gap.
// The knob slides by one option + gap (32px = translate-x-8).
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="relative flex h-10 shrink-0 gap-0.5 rounded-full border border-border bg-background p-1"
    >
      <span
        aria-hidden="true"
        className={`absolute top-1 left-1 size-7.5 rounded-full bg-foreground-soft transition-transform duration-150 ease-out ${
          theme === "dark" ? "translate-x-8" : "translate-x-0"
        }`}
      />
      {OPTIONS.map(({ value, label, Icon }) => {
        const selected = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            onClick={() => setTheme(value)}
            className={`relative flex size-7.5 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
              selected ? "text-background" : "text-foreground-strong"
            }`}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
