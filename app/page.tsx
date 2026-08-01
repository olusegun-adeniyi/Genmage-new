import { Canvas } from "@/components/canvas/canvas";
import { PromptInput } from "@/components/prompt/prompt-input";
import { SampleImagesRow } from "@/components/prompt/sample-images-row";
import { StyleSwitcher } from "@/components/prompt/style-switcher";
import { TopBar } from "@/components/shell/top-bar";
import { getActiveStyles } from "@/lib/db/queries/styles";

export default async function Home() {
  const activeStyles = await getActiveStyles();
  const styleTiles = activeStyles.map(({ id, name }) => ({ id, name }));

  return (
    <>
      {/* Mobile layout — single screen, no result route yet (Phase D) */}
      <div className="min-h-dvh bg-background md:hidden">
        <div className="m-4 flex min-h-[calc(100dvh-2rem)] flex-col gap-6 rounded-2xl border border-border bg-muted p-6">
          <TopBar />
          <div className="flex flex-col gap-28">
            <StyleSwitcher styles={styleTiles} />
            <PromptInput />
            <SampleImagesRow size="mobile" />
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden min-h-dvh items-center justify-center bg-background p-6 md:flex">
        <div className="grid min-h-[calc(100dvh-3rem)] w-full grid-cols-[36%_1fr] gap-8 rounded-2xl border border-border bg-muted p-8">
          <div className="flex flex-col gap-6">
            <TopBar />
            <div className="flex flex-col gap-28">
              <StyleSwitcher styles={styleTiles} />
              <PromptInput />
              <SampleImagesRow size="desktop" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Canvas className="w-full" />
          </div>
        </div>
      </div>
    </>
  );
}
