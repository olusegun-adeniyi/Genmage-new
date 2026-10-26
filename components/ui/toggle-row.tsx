type ToggleRowProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

// An on/off row that sits with the colour rows: same 32px field, muted label
// left, the switch right. The whole row is the hit target. "On" reads as ink
// and the knob's position — never the primary colour, which is Generate's alone.
export function ToggleRow({ label, checked, onChange, disabled = false }: ToggleRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex h-8 w-full items-center justify-between rounded-md bg-field px-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
        disabled ? "cursor-default opacity-50" : "cursor-pointer"
      }`}
    >
      <span className={checked ? "text-foreground" : "text-muted-foreground"}>{label}</span>
      <span
        aria-hidden="true"
        className={`relative h-4 w-7 shrink-0 rounded-full transition-colors duration-150 ease-out ${
          checked ? "bg-foreground" : "bg-tick"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-3 rounded-full bg-background transition-transform duration-150 ease-out ${
            checked ? "translate-x-3" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
