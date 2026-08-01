export function CanvasControls() {
  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <button
        type="button"
        disabled
        className="h-9 rounded-full border border-border bg-background px-4 text-sm text-muted-foreground"
      >
        Square 1:1 ▾
      </button>
      <button
        type="button"
        disabled
        className="h-9 rounded-full border border-border bg-background px-4 text-sm text-muted-foreground"
      >
        Export ↓
      </button>
    </div>
  );
}
