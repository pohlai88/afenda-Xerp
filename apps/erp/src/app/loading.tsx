import { Skeleton } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

export type ErpRootLoadingGovernedComponents = Extract<
  GovernedUiComponentName,
  "Skeleton"
>;

export default function RootLoading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-screen flex-col items-center justify-center gap-4 p-6"
    >
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </main>
  );
}
