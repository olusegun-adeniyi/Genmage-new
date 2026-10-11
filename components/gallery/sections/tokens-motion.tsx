import { motion } from "@/design/tokens";
import { SectionHeading } from "@/components/gallery/primitives";

const DEMOS = [
  {
    label: "durationDefault",
    detail: `${motion.durationDefault} ${motion.easingDefault} — every hover, selection and state change`,
    className: "duration-150",
  },
  {
    label: "durationLabel",
    detail: `${motion.durationLabel} — slider label flipping as the fill passes under it`,
    className: "duration-120",
  },
  {
    label: "durationImageFade",
    detail: `${motion.durationImageFade} ${motion.easingDefault} — the generated illustration fading in`,
    className: "duration-400",
  },
];

export function TokensMotionSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="tokens-motion"
        title="Motion"
        description="Snap, not float. Hover a track to preview. All motion is disabled under prefers-reduced-motion."
      />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {DEMOS.map((demo) => (
          <div key={demo.label} className="flex flex-col gap-2">
            <p className="text-foreground-strong">{demo.label}</p>
            <p className="text-muted-foreground">{demo.detail}</p>
            <div className="group relative h-12 w-full overflow-hidden rounded-md bg-field">
              <div
                className={`absolute top-1/2 left-2 size-8 -translate-y-1/2 rounded-sm bg-slider-fill transition-transform ease-out group-hover:translate-x-32 ${demo.className}`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
