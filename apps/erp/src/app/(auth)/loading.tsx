import { Skeleton } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

export type ErpAuthLoadingGovernedComponents = Extract<
  GovernedUiComponentName,
  "Skeleton"
>;

export default function AuthLoading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-48 flex-col gap-4 p-6"
    >
      <Skeleton />
      <Skeleton />
    </div>
  );
}
