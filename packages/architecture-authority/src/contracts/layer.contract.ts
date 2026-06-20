import type { ArchitectureLayer } from "./package.contract.js";

export interface LayerDefinition {
  readonly layer: ArchitectureLayer;
  readonly ownerDomain: string;
  readonly owns: string;
  readonly rank: number;
}

export interface LayerContract {
  readonly allowedTargets: Readonly<
    Record<ArchitectureLayer, readonly ArchitectureLayer[]>
  >;
  readonly assignments: Readonly<Record<string, ArchitectureLayer>>;
  readonly layers: readonly LayerDefinition[];
  /** Same-layer runtime deps: allowed layers pass matrix check when from === to */
  readonly sameLayerAllowed: Readonly<Record<ArchitectureLayer, boolean>>;
}
