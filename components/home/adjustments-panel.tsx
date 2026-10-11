import type { Ref } from "react";

import { ColourRow } from "@/components/ui/colour-row";
import { SliderRow } from "@/components/ui/slider-row";
import { BORDER_WEIGHT_CONTROL, DEPTH_CONTROLS, type AdjustmentControl } from "@/lib/edit/adjustment-controls";
import type { EditState } from "@/lib/validation/edit-state";

type AdjustmentsPanelProps = {
  ref?: Ref<HTMLElement>;
  editState: EditState;
  onChange: (patch: Partial<EditState>) => void;
  // Edits belong to a specific generation — with nothing on the canvas there's
  // nothing to edit, so the controls read as unavailable, not inert.
  disabled: boolean;
};

export function AdjustmentsPanel({ ref, editState, onChange, disabled }: AdjustmentsPanelProps) {
  function renderSlider(control: AdjustmentControl) {
    return (
      <SliderRow
        key={control.key}
        label={control.label}
        value={editState[control.key]}
        min={control.min}
        max={control.max}
        unit={control.unit}
        ticks={control.ticks}
        disabled={disabled}
        onChange={(value) => onChange({ [control.key]: value })}
      />
    );
  }

  return (
    // At lg it floats in the canvas's top-right corner (positioned by CanvasPanel),
    // hugging its content; on a very short viewport it caps at the canvas height
    // and scrolls inside itself.
    <section
      ref={ref}
      aria-label="Illustration depth"
      className="flex min-h-0 flex-col gap-4 rounded-2xl border border-border bg-background p-3.5 lg:max-h-full lg:w-adjustments-panel lg:overflow-y-auto"
    >
      <h2 className="text-foreground-strong">Illustration depth</h2>
      <div className="flex flex-col gap-2.5">{DEPTH_CONTROLS.map(renderSlider)}</div>
      <div className="h-0.5 shrink-0 bg-divider" aria-hidden="true" />
      <div className="flex flex-col gap-2.5">
        {renderSlider(BORDER_WEIGHT_CONTROL)}
        <ColourRow
          label="Border colour"
          value={editState.borderColor}
          disabled={disabled}
          onChange={(borderColor) => onChange({ borderColor })}
        />
        <ColourRow
          label="Background colour"
          value={editState.backgroundColor}
          disabled={disabled}
          onChange={(backgroundColor) => onChange({ backgroundColor })}
          onClear={() => onChange({ backgroundColor: null })}
        />
      </div>
    </section>
  );
}
