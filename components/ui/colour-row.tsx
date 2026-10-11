import { X } from "lucide-react";

type ColourRowProps = {
  label: string;
  // null = no colour chosen (only rows that pass onClear can be empty).
  value: string | null;
  onChange: (hex: string) => void;
  onClear?: () => void;
  disabled?: boolean;
};

// The native picker needs a hex even when the row is empty — it opens on white.
const PICKER_FALLBACK = "#ffffff";

// The native colour input covers the whole row (invisible) so the entire 32px row
// is the hit target and the OS picker opens from it — no custom picker to maintain.
export function ColourRow({ label, value, onChange, onClear, disabled = false }: ColourRowProps) {
  return (
    // Focus ring keys off the colour input only — the clear button draws its own.
    <label
      className={`relative flex h-8 items-center justify-between rounded-md bg-field px-3 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-foreground ${
        disabled ? "cursor-default opacity-50" : "cursor-pointer"
      }`}
    >
      <span className="text-muted-foreground">
        {label}
        {value === null && <span className="sr-only">, none</span>}
      </span>
      <input
        type="color"
        value={value ?? PICKER_FALLBACK}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`absolute inset-0 size-full opacity-0 ${disabled ? "cursor-default" : "cursor-pointer"}`}
      />
      <span className="flex items-center gap-1.5">
        {/* relative z-10 lifts it above the invisible input, so it clears the
            colour instead of opening the picker. */}
        {value !== null && onClear && (
          <button
            type="button"
            disabled={disabled}
            onClick={onClear}
            aria-label={`Remove ${label.toLowerCase()}`}
            className={`relative z-10 flex size-4 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-2 focus-visible:outline-foreground ${
              disabled ? "cursor-default" : "cursor-pointer"
            }`}
          >
            <X className="size-3" strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}
        {value === null ? (
          <span className="size-4 rounded-full border border-dashed border-tick" aria-hidden="true" />
        ) : (
          <span className="size-4 rounded-full shadow-swatch" style={{ backgroundColor: value }} aria-hidden="true" />
        )}
      </span>
    </label>
  );
}
