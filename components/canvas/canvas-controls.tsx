import { Button } from "@/components/ui/button";

export function CanvasControls() {
  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <Button variant="secondary" disabled>
        Square 1:1 ▾
      </Button>
      {/* Accent is reserved exclusively for this button — see DESIGN-SYSTEM.md */}
      <Button variant="accent" disabled>
        Export ↓
      </Button>
    </div>
  );
}
