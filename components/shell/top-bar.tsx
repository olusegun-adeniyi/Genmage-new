// No page-level chrome anymore (info button removed) — just the wordmark,
// centered within whatever column/card it's placed in.
export function TopBar() {
  return (
    <p className="text-center text-base font-medium tracking-tight text-foreground md:text-sm">
      genmage
    </p>
  );
}
