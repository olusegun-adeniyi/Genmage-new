import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "accent" | "secondary" | "icon";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant: ButtonVariant;
  // Gallery-only: forces the :active press look statically so it can sit next
  // to the default state in a screenshot. Production call sites never pass this —
  // real press feedback comes from the active: classes below.
  demoState?: "active";
};

const BASE =
  "inline-flex items-center justify-center transition-[transform,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40";

const PRESS = "active:scale-95 active:opacity-80";
const PRESS_FORCED = "scale-95 opacity-80";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "h-11 rounded-full bg-foreground px-5 text-base font-medium text-background md:h-10 md:px-6",
  // Reserved exclusively for Export — never used elsewhere. See DESIGN-SYSTEM.md "Never" list.
  accent: "h-9 rounded-full bg-accent px-4 text-sm font-medium text-foreground-on-dark",
  secondary: "h-9 rounded-full border border-border bg-background px-4 text-sm text-muted-foreground",
  icon: "size-8 rounded-full border border-border text-muted-foreground",
};

export function Button({ variant, demoState, className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`${BASE} ${VARIANT_CLASSES[variant]} ${demoState === "active" ? PRESS_FORCED : PRESS} ${className ?? ""}`}
      {...props}
    />
  );
}
