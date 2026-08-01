import { motion } from "@/design/tokens";
import { SectionHeading, StatusBadge } from "@/components/gallery/primitives";

function MotionDemo({
  label,
  detail,
  demoClassName,
  planned,
}: {
  label: string;
  detail: string;
  demoClassName: string;
  planned?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">{label}</p>
        {planned && <StatusBadge status="planned" />}
      </div>
      <p className="font-mono text-xs text-muted-foreground">{detail}</p>
      <div className="group relative h-12 w-full max-w-64 overflow-hidden rounded-md bg-muted">
        <div className={`absolute top-1/2 left-2 size-8 -translate-y-1/2 rounded-sm bg-foreground ${demoClassName}`} />
      </div>
      <p className="text-xs text-muted-foreground">Hover the track to preview.</p>
    </div>
  );
}

export function TokensMotionSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="tokens-motion"
        title="Motion"
        description="Snap, not float. Real durations from live code below; durationImageFade has no live usage yet since no generation flow is wired up."
      />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <MotionDemo
          label="durationDefault"
          detail={`${motion.durationDefault} · ease-out — the base-layer default, applied to every element`}
          demoClassName="transition-transform duration-150 ease-out group-hover:translate-x-44"
        />
        <MotionDemo
          label="durationLong"
          detail={`${motion.durationLong} · ease-out — placeholder rotation fade in the prompt input`}
          demoClassName="transition-transform duration-300 ease-out group-hover:translate-x-44"
        />
        <MotionDemo
          label="durationImageFade"
          detail={`${motion.durationImageFade} · ease-standard — generation reveal`}
          demoClassName="transition-transform duration-[400ms] ease-standard group-hover:translate-x-44"
          planned
        />
        <MotionDemo
          label="easingDefault (the raw token curve)"
          detail={`${motion.easingDefault} — distinct from Tailwind's ease-out, which is what transition-*  classes actually use today. See DESIGN-SYSTEM.md → Motion.`}
          demoClassName="transition-transform duration-300 ease-standard group-hover:translate-x-44"
        />
      </div>
    </section>
  );
}
