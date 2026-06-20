export const DEPENDENCY_CLASSIFICATIONS = [
  "Approved",
  "Dev-only exempt",
  "Exception",
  "Deprecated",
  "Blocked",
] as const;

export type DependencyClassification =
  (typeof DEPENDENCY_CLASSIFICATIONS)[number];

export interface DependencyEdge {
  readonly classification: DependencyClassification;
  readonly from: string;
  readonly to: string;
}

export interface DependencyContract {
  readonly approvedRuntimeByPackage: Readonly<
    Record<string, readonly string[]>
  >;
  readonly devOnlyExempt: readonly DependencyEdge[];
  readonly runtimeEdges: readonly DependencyEdge[];
}
