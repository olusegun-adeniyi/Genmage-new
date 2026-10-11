import { PromptBox } from "@/components/prompt/prompt-box";
import { StyleGrid, type StyleOption } from "@/components/prompt/style-grid";

type GeneratePanelProps = {
  styles: StyleOption[];
  selectedStyleId: string;
  onSelectStyle: (id: string) => void;
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
};

export function GeneratePanel({
  styles,
  selectedStyleId,
  onSelectStyle,
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating,
}: GeneratePanelProps) {
  return (
    // Hugs its content; the Recently generated panel below takes the rest of the column.
    <section
      aria-label="Generate"
      className="flex shrink-0 flex-col gap-2 rounded-2xl border border-border bg-background px-3.5 pt-4 pb-3.5"
    >
      <h2 className="text-foreground-strong">Generate a style of illustration</h2>
      <StyleGrid styles={styles} selectedId={selectedStyleId} onSelect={onSelectStyle} />
      <PromptBox value={prompt} onValueChange={onPromptChange} onGenerate={onGenerate} isGenerating={isGenerating} />
    </section>
  );
}
