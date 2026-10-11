import { Toast } from "@/components/ui/toast";
import { SectionHeading } from "@/components/gallery/primitives";

export function ComponentToastSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="components-toast"
        title="Toast notification"
        description={`Fires from Share (link copied) and from Export/Generate failures. Auto-dismisses in 3s, aria-live="polite" so it doesn't steal focus.`}
        status="live"
      />
      <div className="relative h-32 overflow-hidden rounded-lg bg-field">
        <Toast message="Link copied" contained />
      </div>
    </section>
  );
}
