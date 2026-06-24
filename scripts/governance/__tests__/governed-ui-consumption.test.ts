import { describe, expect, it } from "vitest";

import {
  checkConsumerClassNameSlop,
  detectConsumerClassNameViolation,
} from "../consumer-class-name-policy.mjs";
import {
  checkConsumerGateDPolicies,
  checkGovernedUiConsumption,
} from "../governed-ui-consumption.mjs";

describe("consumer-class-name-policy", () => {
  it("allows semantic bridge utilities on wrappers", () => {
    expect(
      checkConsumerClassNameSlop(
        "bg-muted text-muted-foreground rounded-lg border-border flex gap-4"
      )
    ).toEqual([]);
  });

  it("rejects gradient and glass slop", () => {
    const violations = checkConsumerClassNameSlop(
      "bg-gradient-to-r from-purple-500 to-cyan-500 backdrop-blur-md"
    );
    expect(violations.length).toBeGreaterThan(0);
    expect(violations.map((v) => v.token)).toEqual(
      expect.arrayContaining([
        "bg-gradient-to-r",
        "from-purple-500",
        "backdrop-blur-md",
      ])
    );
  });

  it("rejects arbitrary values and raw palette scales", () => {
    expect(detectConsumerClassNameViolation("rounded-[14px]")?.reason).toMatch(
      /arbitrary radius/
    );
    expect(detectConsumerClassNameViolation("bg-red-500")?.reason).toMatch(
      /raw palette/
    );
  });
});

describe("checkGovernedUiConsumption", () => {
  it("requires @afenda/ui/governance when @afenda/ui is used", () => {
    const violations = checkGovernedUiConsumption(`
      import { DropdownMenu } from "@afenda/ui";
      export function X() {
        return <DropdownMenu />;
      }
    `);
    expect(violations.some((v) => v.includes("@afenda/ui/governance"))).toBe(
      true
    );
  });

  it("rejects className on governed primitives (single-line)", () => {
    const violations = checkGovernedUiConsumption(`
      import { Button } from "@afenda/ui";
      import { mapStockButtonProps } from "@afenda/ui/governance";
      export function X() {
        return <Button className="relative gap-2" {...mapStockButtonProps("ghost", "sm")} />;
      }
    `);
    expect(violations.some((v) => v.includes("<Button className"))).toBe(true);
  });

  it("rejects className on governed primitives (multiline split)", () => {
    const violations = checkGovernedUiConsumption(`
      import { Badge } from "@afenda/ui";
      import type { GovernedBadgeProps } from "@afenda/ui/governance";
      export function X() {
        return (
          <Badge
            className="bg-green-500"
          >
            Active
          </Badge>
        );
      }
    `);
    expect(violations.some((v) => v.includes("multiline split"))).toBe(true);
  });

  it("rejects dynamic className on governed primitives", () => {
    const violations = checkGovernedUiConsumption(`
      import { Card } from "@afenda/ui";
      import type { GovernedUiComponentName } from "@afenda/ui/governance";
      export function X() {
        return <Card className={\`rounded-xl shadow-lg\`} />;
      }
    `);
    expect(violations.some((v) => v.includes("<Card className"))).toBe(true);
  });

  it("rejects stock Button variant prop", () => {
    const violations = checkGovernedUiConsumption(`
      import { Button } from "@afenda/ui";
      import { mapStockButtonProps } from "@afenda/ui/governance";
      export function X() {
        return <Button variant="destructive">Delete</Button>;
      }
    `);
    expect(violations.some((v) => v.includes("variant"))).toBe(true);
  });

  it("rejects stock Button icon size props", () => {
    const violations = checkGovernedUiConsumption(`
      import { Button } from "@afenda/ui";
      import { mapStockButtonProps } from "@afenda/ui/governance";
      export function X() {
        return <Button size="icon-lg" />;
      }
    `);
    expect(violations.some((v) => v.includes("stock shadcn size"))).toBe(true);
  });

  it("flags visual slop on plain wrapper className strings", () => {
    const violations = checkGovernedUiConsumption(`
      import { Button } from "@afenda/ui";
      import { mapStockButtonProps } from "@afenda/ui/governance";
      export function X() {
        return (
          <div className="bg-gradient-to-r from-blue-500 flex">
            <Button {...mapStockButtonProps("ghost", "sm")} />
          </div>
        );
      }
    `);
    expect(violations.some((v) => v.includes("visual slop"))).toBe(true);
  });

  it("accepts compliant consumer composition", () => {
    const violations = checkGovernedUiConsumption(`
      import { Button } from "@afenda/ui";
      import { mapStockButtonProps } from "@afenda/ui/governance";
      export function X() {
        return (
          <div className="relative flex items-center gap-2">
            <Button {...mapStockButtonProps("ghost", "icon-lg")} />
            <span className="bg-destructive absolute size-2 rounded-full" aria-hidden />
          </div>
        );
      }
    `);
    expect(violations).toEqual([]);
  });
});

describe("checkConsumerGateDPolicies", () => {
  it("rejects staging primitive imports from appshell production", () => {
    const violations = checkConsumerGateDPolicies(
      `import { Button } from "#/components/shadcn-studio/primitives/button.tsx";`,
      "packages/appshell/src/foo.tsx"
    );
    expect(violations.some((v) => v.includes("Staging primitive"))).toBe(true);
  });

  it("allows staging imports outside consumer packages", () => {
    const violations = checkConsumerGateDPolicies(
      `import { Button } from "#/components/shadcn-studio/primitives/button.tsx";`,
      "packages/ui/src/components/shadcn-studio/dialog/dialog-09.tsx"
    );
    expect(violations).toEqual([]);
  });

  it("rejects raw Tailwind utilities in studio block className", () => {
    const violations = checkConsumerGateDPolicies(
      `<div className="flex gap-4 app-shell-dashboard-widget">`,
      "packages/appshell/src/shadcn-studio/blocks/example-block.tsx"
    );
    expect(violations.some((v) => v.includes("raw Tailwind"))).toBe(true);
  });

  it("allows app-shell semantic classes in studio blocks", () => {
    const violations = checkConsumerGateDPolicies(
      `<div className="app-shell-studio-metric-card"><span className="sr-only">Label</span></div>`,
      "packages/appshell/src/shadcn-studio/blocks/example-block.tsx"
    );
    expect(violations).toEqual([]);
  });

  it("rejects non-Lucide icon imports in studio blocks", () => {
    const violations = checkConsumerGateDPolicies(
      `import { FaBeer } from "react-icons/fa";`,
      "packages/appshell/src/shadcn-studio/blocks/example-block.tsx"
    );
    expect(violations.some((v) => v.includes("Non-Lucide"))).toBe(true);
  });

  it("rejects new mapStockButtonProps usages in production consumer files", () => {
    const violations = checkConsumerGateDPolicies(
      `import { mapStockButtonProps } from "@afenda/ui/governance";`,
      "packages/appshell/src/new-feature.tsx"
    );
    expect(
      violations.some((v) => v.includes("mapStockButtonProps is sunset"))
    ).toBe(true);
  });

  it("skips mapStockButtonProps check in __tests__", () => {
    const violations = checkConsumerGateDPolicies(
      `import { mapStockButtonProps } from "@afenda/ui/governance";`,
      "packages/appshell/src/__tests__/harness.tsx"
    );
    expect(
      violations.some((v) => v.includes("mapStockButtonProps is sunset"))
    ).toBe(false);
  });
});
