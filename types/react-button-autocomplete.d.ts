import "react";

// Browsers honour autocomplete="off" on <button> — Firefox uses it to skip
// restoring a button's disabled state on reload (see components/ui/button.tsx) —
// but React's types only declare autoComplete on inputs, selects, textareas and forms.
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- type parameter must match React's declaration for the interfaces to merge
  interface ButtonHTMLAttributes<T> {
    autoComplete?: "off" | "on";
  }
}
