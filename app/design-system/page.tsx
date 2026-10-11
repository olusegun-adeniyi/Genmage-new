import { OverviewSection } from "@/components/gallery/sections/overview";
import { TokensColorsSection } from "@/components/gallery/sections/tokens-colors";
import { TokensRadiiSection } from "@/components/gallery/sections/tokens-radii";
import { TokensSpacingSection } from "@/components/gallery/sections/tokens-spacing";
import { TokensTypographySection } from "@/components/gallery/sections/tokens-typography";
import { TokensMotionSection } from "@/components/gallery/sections/tokens-motion";
import { ComponentStyleTileSection } from "@/components/gallery/sections/component-style-tile";
import { ComponentGenerateSection } from "@/components/gallery/sections/component-generate";
import { ComponentButtonsSection } from "@/components/gallery/sections/component-buttons";
import { ComponentActionBarSection } from "@/components/gallery/sections/component-action-bar";
import { ComponentSliderSection } from "@/components/gallery/sections/component-slider";
import { ComponentToastSection } from "@/components/gallery/sections/component-toast";
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
    <div className="mx-auto flex max-w-4xl flex-col gap-28">
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
        <ComponentStyleTileSection />
        <ComponentGenerateSection />
        <ComponentButtonsSection />
        <ComponentActionBarSection />
        <ComponentSliderSection />
        <ComponentToastSection />
      </div>

      <RulesSection />
    </div>
  );
}
