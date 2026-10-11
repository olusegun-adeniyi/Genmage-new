import { HomeShell } from "@/components/home/home-shell";
import { getActiveStyles } from "@/lib/db/queries/styles";

export default async function Home() {
  const activeStyles = await getActiveStyles();
  const styles = activeStyles.map(({ id, name }) => ({ id, name }));

  return (
    // ≥ lg: exactly one viewport tall with an equal 20px margin on every side —
    // the page itself never scrolls.
    <main className="flex min-h-dvh items-start justify-center p-4 md:p-6 lg:h-dvh lg:p-5">
      <HomeShell styles={styles} />
    </main>
  );
}
