import { PromptInput } from "@/components/prompt/prompt-input";
import { SectionHeading } from "@/components/gallery/primitives";

export function ComponentPromptInputSection() {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        id="components-prompt-input"
        title="Prompt input"
        description={`The focused instance is a real autofocus, not a faked ring — this also closed a gap: the textarea removed its focus ring with no substitute (focus:ring-0), so keyboard focus was invisible. The container now gets a focus-within ring.`}
        status="live"
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-2">
          <PromptInput />
          <p className="text-xs text-muted-foreground">Empty — placeholder visible</p>
        </div>
        <div className="flex flex-col gap-2">
          <PromptInput initialValue="a red fox curled in autumn leaves" />
          <p className="text-xs text-muted-foreground">Filled</p>
        </div>
        <div className="flex flex-col gap-2">
          <PromptInput autoFocus />
          <p className="text-xs text-muted-foreground">Focused (real DOM focus)</p>
        </div>
      </div>
    </section>
  );
}
