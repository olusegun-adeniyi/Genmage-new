// MingCute icons (https://www.mingcute.com, Apache-2.0), inlined from the
// `mingcute_icon` SVG set rather than adding a dependency for two glyphs.
// Paths are verbatim; only the fill is switched to currentColor so the icons
// take their colour from the surrounding text-* class.

type IconProps = {
  className?: string;
};

/** MingCute `box_2_fill` — archive box with lid and handle. */
export function ArchiveBoxIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9zm-7 3h-4a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2m6-10a2 2 0 0 1 2 2v3H2V5a2 2 0 0 1 2-2z"
      />
    </svg>
  );
}

/** MingCute `mountain_2_fill` — two peaks, the larger snow-capped. */
export function MountainsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8.701 5.75c.577-1 2.02-1 2.598 0l3.5 6.062.902-1.562c.577-1 2.02-1 2.598 0l4.33 7.5A1.5 1.5 0 0 1 21.33 20H17v-.002a1.555 1.555 0 0 1-.072.002H3.072a1.5 1.5 0 0 1-1.3-2.25zm-.91 5.576.709.472.945-.63a1 1 0 0 1 1.11 0l.945.63.709-.472L10 7.5z"
      />
    </svg>
  );
}

/** MingCute `sun_line`. */
export function SunIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 19a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1m6.364-2.05.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 1.414-1.414m-12.728 0a1 1 0 0 1 1.497 1.32l-.083.094-.707.707a1 1 0 0 1-1.497-1.32l.083-.094zM12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12m0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8m-8 3a1 1 0 0 1 .117 1.993L4 13H3a1 1 0 0 1-.117-1.993L3 11zm17 0a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2zM4.929 4.929a1 1 0 0 1 1.32-.083l.094.083.707.707a1 1 0 0 1-1.32 1.497l-.094-.083-.707-.707a1 1 0 0 1 0-1.414m14.142 0a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0M12 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1"
      />
    </svg>
  );
}

/** MingCute `moon_line`. */
export function MoonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M13.574 3.137a1.01 1.01 0 0 0-1.097 1.409 6 6 0 0 1-7.931 7.931 1.01 1.01 0 0 0-1.409 1.097A9 9 0 0 0 21 12c0-4.434-3.206-8.118-7.426-8.863m1.307 2.481A7.002 7.002 0 0 1 12 19a7.002 7.002 0 0 1-6.382-4.12 8 8 0 0 0 9.263-9.263Z"
      />
    </svg>
  );
}
