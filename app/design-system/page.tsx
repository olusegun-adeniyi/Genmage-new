import { spacing } from "@/design/tokens";

import { OverviewSection } from "@/components/gallery/sections/overview";
import { TokensColorsSection } from "@/components/gallery/sections/tokens-colors";
import { TokensRadiiSection } from "@/components/gallery/sections/tokens-radii";
import { TokensSpacingSection } from "@/components/gallery/sections/tokens-spacing";
import { TokensTypographySection } from "@/components/gallery/sections/tokens-typography";
import { TokensMotionSection } from "@/components/gallery/sections/tokens-motion";
import { ComponentWordmarkSection } from "@/components/gallery/sections/component-wordmark";
import { ComponentStyleTileSection } from "@/components/gallery/sections/component-style-tile";
import { ComponentSampleCardSection } from "@/components/gallery/sections/component-sample-card";
import { ComponentPromptInputSection } from "@/components/gallery/sections/component-prompt-input";
import { ComponentButtonsSection } from "@/components/gallery/sections/component-buttons";
import { ComponentCanvasSection } from "@/components/gallery/sections/component-canvas";
import { ComponentSliderSection } from "@/components/gallery/sections/component-slider";
import { ComponentSwatchPickerSection } from "@/components/gallery/sections/component-swatch-picker";
import { ComponentHistoryEntrySection } from "@/components/gallery/sections/component-history-entry";
import { ComponentToastSection } from "@/components/gallery/sections/component-toast";
import { ComponentPanelsSection } from "@/components/gallery/sections/component-panels";
import { LayoutPatternsSection } from "@/components/gallery/sections/layout-patterns";
import { RulesSection } from "@/components/gallery/sections/rules";

function GroupHeading({ id, title }: { id: string; title: string }) {
  return (
    <h1 id={id} className="scroll-mt-8 text-2xl font-semibold tracking-tight">
      {title}
    </h1>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col" style={{ gap: spacing.sectionGap }}>
      <OverviewSection />

      <div className="flex flex-col gap-12">
        <GroupHeading id="tokens" title="Tokens" />
        <TokensColorsSection />
        <TokensRadiiSection />
        <TokensSpacingSection />
        <TokensTypographySection />
        <TokensMotionSection />
      </div>

      <div className="flex flex-col gap-12">
        <GroupHeading id="components" title="Components" />
        <ComponentWordmarkSection />
        <ComponentStyleTileSection />
        <ComponentSampleCardSection />
        <ComponentPromptInputSection />
        <ComponentButtonsSection />
        <ComponentCanvasSection />
        <ComponentSliderSection />
        <ComponentSwatchPickerSection />
        <ComponentHistoryEntrySection />
        <ComponentToastSection />
        <ComponentPanelsSection />
      </div>

      <LayoutPatternsSection />
      <RulesSection />
    </div>
  );
}
