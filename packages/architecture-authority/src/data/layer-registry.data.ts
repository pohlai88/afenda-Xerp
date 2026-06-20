import type { LayerContract } from "../contracts/layer.contract.js";
import type { ArchitectureLayer } from "../contracts/package.contract.js";

export const layerContract: LayerContract = {
  layers: [
    {
      layer: "Platform",
      rank: 1,
      owns: "Platform truth",
      ownerDomain: "Platform Authority",
    },
    {
      layer: "Design",
      rank: 2,
      owns: "Visual truth",
      ownerDomain: "Design Authority",
    },
    {
      layer: "Foundation",
      rank: 2,
      owns: "Shared infrastructure",
      ownerDomain: "Platform Authority",
    },
    {
      layer: "Metadata",
      rank: 3,
      owns: "Rendering truth",
      ownerDomain: "Metadata Authority",
    },
    {
      layer: "Integration",
      rank: 3,
      owns: "Cross-cutting integration",
      ownerDomain: "Platform Authority",
    },
    {
      layer: "ERPSpine",
      rank: 4,
      owns: "ERP operating shell",
      ownerDomain: "ERP Spine Authority",
    },
    {
      layer: "Domain",
      rank: 5,
      owns: "Business truth",
      ownerDomain: "Domain Authority",
    },
    {
      layer: "Application",
      rank: 6,
      owns: "Delivery surfaces",
      ownerDomain: "Application Authority",
    },
  ],
  assignments: {
    "@afenda/auth": "Platform",
    "@afenda/database": "Platform",
    "@afenda/observability": "Platform",
    "@afenda/permissions": "Platform",
    "@afenda/typescript-config": "Platform",
    "@afenda/architecture-authority": "Platform",
    "@afenda/design-system": "Design",
    "@afenda/ui": "Design",
    "@afenda/execution": "Foundation",
    "@afenda/kernel": "Foundation",
    "@afenda/storage": "Foundation",
    "@afenda/metadata-ui": "Metadata",
    "@afenda/entitlements": "Integration",
    "@afenda/feature-flags": "Integration",
    "@afenda/testing": "Integration",
    "@afenda/appshell": "ERPSpine",
    "@afenda/erp": "Application",
    "@afenda/docs": "Application",
  },
  allowedTargets: {
    Application: [
      "ERPSpine",
      "Domain",
      "Metadata",
      "Integration",
      "Foundation",
      "Design",
      "Platform",
    ],
    Domain: ["Metadata", "Integration", "Foundation", "Design", "Platform"],
    ERPSpine: ["Metadata", "Integration", "Foundation", "Design", "Platform"],
    Metadata: ["Design", "Platform"],
    Integration: ["Foundation", "Platform"],
    Foundation: ["Platform"],
    Design: ["Platform"],
    Platform: [],
  },
  sameLayerAllowed: {
    Application: false,
    Domain: false,
    ERPSpine: false,
    Metadata: false,
    Integration: true,
    Foundation: true,
    Design: false,
    Platform: true,
  },
};

export function getPackageLayer(
  packageName: string
): ArchitectureLayer | undefined {
  return layerContract.assignments[packageName];
}

export function isLayerDependencyAllowed(
  fromLayer: ArchitectureLayer,
  toLayer: ArchitectureLayer
): boolean {
  if (fromLayer === toLayer) {
    return layerContract.sameLayerAllowed[fromLayer];
  }
  return layerContract.allowedTargets[fromLayer].includes(toLayer);
}
