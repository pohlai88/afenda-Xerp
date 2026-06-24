import { describe, expect, it } from "vitest";

import {
  checkCssBridgeNegativeSearch,
  formatCssBridgeAttestation,
  isMapStockButtonPropsExemptPath,
  probeNs1StagingRefs,
  probeNs2StagingImports,
  probeNs3BlockTailwind,
  probeNs4MapStockButtonProps,
  probeNs5NonLucideIcons,
} from "../check-css-bridge-negative-search.mjs";

describe("check-css-bridge-negative-search probes", () => {
  it("NS1 flags staging path references in production files", () => {
    const content =
      'const x = "packages/ui/src/components/shadcn-studio/blocks/foo";';
    const hits = probeNs1StagingRefs(content, "apps/erp/src/lib/foo.ts");
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatch(/staging path/);
  });

  it("NS1 passes when staging path is absent", () => {
    expect(
      probeNs1StagingRefs(
        'import { Button } from "@afenda/ui";',
        "apps/erp/src/lib/foo.ts"
      )
    ).toEqual([]);
  });

  it("NS2 flags forbidden staging imports", () => {
    const content =
      'import { X } from "#/components/shadcn-studio/primitives/button";';
    const hits = probeNs2StagingImports(
      content,
      "packages/appshell/src/foo.tsx"
    );
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatch(/forbidden shadcn-studio staging import/);
  });

  it("NS2 allows appshell shadcn-studio/blocks local paths", () => {
    const content =
      'import { Block } from "../shadcn-studio/blocks/app-shell-menu-trigger";';
    expect(
      probeNs2StagingImports(
        content,
        "packages/appshell/src/app-shell-header.tsx"
      )
    ).toEqual([]);
  });

  it("NS3 flags raw Tailwind in studio block TSX", () => {
    const content =
      'export function X() { return <div className="flex gap-2 p-4" />; }';
    const hits = probeNs3BlockTailwind(
      content,
      "packages/appshell/src/shadcn-studio/blocks/app-shell-menu-trigger.tsx"
    );
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]).toMatch(/semantic classes only/);
  });

  it("NS3 passes semantic app-shell classes in studio blocks", () => {
    const content =
      'export function X() { return <div className="app-shell-menu-trigger" />; }';
    expect(
      probeNs3BlockTailwind(
        content,
        "packages/appshell/src/shadcn-studio/blocks/app-shell-menu-trigger.tsx"
      )
    ).toEqual([]);
  });

  it("NS4 flags mapStockButtonProps in production", () => {
    const content =
      'import { mapStockButtonProps } from "@afenda/ui/governance";';
    const hits = probeNs4MapStockButtonProps(
      content,
      "apps/erp/src/components/foo.tsx"
    );
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatch(/mapStockButtonProps in production/);
  });

  it("NS4 exempts __tests__ and *.test.* paths", () => {
    const content =
      'import { mapStockButtonProps } from "@afenda/ui/governance";';
    expect(
      probeNs4MapStockButtonProps(
        content,
        "apps/erp/src/__tests__/foo.test.tsx"
      )
    ).toEqual([]);
    expect(
      isMapStockButtonPropsExemptPath(
        "scripts/governance/__tests__/bar.test.ts"
      )
    ).toBe(true);
  });

  it("NS5 flags non-Lucide icon imports in studio blocks", () => {
    const content = 'import { FaUser } from "react-icons/fa";';
    const hits = probeNs5NonLucideIcons(
      content,
      "packages/appshell/src/shadcn-studio/blocks/app-shell-profile-dropdown.tsx"
    );
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatch(/Non-Lucide icon import/);
  });

  it("NS5 passes lucide-react imports in studio blocks", () => {
    const content = 'import { User } from "lucide-react";';
    expect(
      probeNs5NonLucideIcons(
        content,
        "packages/appshell/src/shadcn-studio/blocks/app-shell-profile-dropdown.tsx"
      )
    ).toEqual([]);
  });
});

describe("checkCssBridgeNegativeSearch integration", () => {
  it("passes on the current repository production tree", () => {
    const result = checkCssBridgeNegativeSearch();
    expect(result.pass).toBe(true);
    expect(result.counts).toEqual({
      NS1: 0,
      NS2: 0,
      NS3: 0,
      NS4: 0,
      NS5: 0,
    });
  });

  it("prints the 9.5 attestation block on pass", () => {
    const result = checkCssBridgeNegativeSearch();
    const attestation = formatCssBridgeAttestation(result);
    expect(attestation).toContain("CSS Bridge Negative Search — PASS");
    expect(attestation).toContain("NS1 staging refs in production: 0");
    expect(attestation).toContain("NS5 non-Lucide icons in blocks: 0");
  });
});
