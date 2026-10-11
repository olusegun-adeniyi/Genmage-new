// Shared by the server layout (inline script) and the client theme hook — kept
// out of the "use client" module so the server gets real values, not references.

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "genmage:theme";

// Runs inline in <head> before first paint so a saved dark choice never flashes
// light. A string because it must execute before React or any bundle loads.
export const THEME_INIT_SCRIPT = `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;
