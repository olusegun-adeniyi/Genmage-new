type TopBarProps = {
  // Only "light" is used today (the built app has no dark surface yet). "dark"
  // exists so the wordmark is ready for the Phase D controls panel without a
  // second component — see DESIGN-SYSTEM.md → Wordmark.
  variant?: "light" | "dark";
};

// No page-level chrome anymore (info button removed) — just the wordmark,
// centered within whatever column/card it's placed in.
export function TopBar({ variant = "light" }: TopBarProps) {
  return (
    <p
      className={`text-center text-base font-medium tracking-tight md:text-sm ${
        variant === "dark" ? "text-foreground-on-dark" : "text-foreground"
      }`}
    >
      genmage
    </p>
  );
}
