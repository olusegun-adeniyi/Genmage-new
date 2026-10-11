import type { ComponentProps } from "react";

type ButtonVariant = "primary" | "toolbar";

type ButtonProps = ComponentProps<"button"> & {
  variant: ButtonVariant;
};

// Primary is 32px (sits inside the prompt box); toolbar is 36px (fills the 48px
// action bar with 6px padding).
const SIZE: Record<ButtonVariant, string> = {
  primary: "h-8 px-3",
  toolbar: "h-9 px-2.5",
};

const BASE =
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

// Colour is picked from the real `disabled` boolean rather than the :disabled
// CSS variant — an earlier CSS-only version showed the wrong colour in a real
// browser session even though it measured correctly in automated checks.
function variantClasses(variant: ButtonVariant, isDisabled: boolean): string {
  if (variant === "primary") {
    return isDisabled
      ? "cursor-default bg-divider text-disabled-foreground"
      : "cursor-pointer bg-primary text-primary-foreground";
  }
  return isDisabled
    ? "cursor-default bg-background text-disabled-foreground"
    : "cursor-pointer bg-background text-foreground hover:bg-border";
}

export function Button({ variant, className, disabled, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      // Firefox restores a button's previous disabled state on reload, before
      // React hydrates — a hydration mismatch on Generate. autoComplete="off"
      // opts the button out of that form-state restoration.
      autoComplete="off"
      disabled={disabled}
      className={`${BASE} ${SIZE[variant]} ${variantClasses(variant, Boolean(disabled))} ${className ?? ""}`}
      {...props}
    />
  );
}
