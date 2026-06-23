import { describe, expect, it } from "vitest";

import {
  checkChartA11y,
  checkForwardRef,
  checkModuleMutableState,
  checkRawImg,
  checkReactErpQuality,
  checkStaticRechartsImport,
  checkUseEffectDerivedState,
} from "../react-erp-policy.mjs";

// ─── R1: Static recharts import ───────────────────────────────────────────────

describe("checkStaticRechartsImport", () => {
  it("flags static import from recharts", () => {
    const violations = checkStaticRechartsImport(
      `import { AreaChart, ResponsiveContainer } from "recharts";`
    );
    expect(violations.length).toBe(1);
    expect(violations[0]).toMatch(/recharts/);
    expect(violations[0]).toMatch(/next\/dynamic/);
  });

  it("ignores files that do not import recharts", () => {
    expect(
      checkStaticRechartsImport(`import { Button } from "@afenda/ui";`)
    ).toEqual([]);
  });
});

// ─── R2: forwardRef ───────────────────────────────────────────────────────────

describe("checkForwardRef", () => {
  it("flags React.forwardRef()", () => {
    const violations = checkForwardRef(
      "const Field = React.forwardRef<HTMLInputElement, FieldProps>((props, ref) => <input {...props} ref={ref} />);"
    );
    expect(violations.length).toBe(1);
    expect(violations[0]).toMatch(/React 19/);
  });

  it("flags bare forwardRef()", () => {
    const violations = checkForwardRef(
      "const Field = forwardRef((props, ref) => <input ref={ref} />);"
    );
    expect(violations.length).toBe(1);
  });

  it("ignores files without forwardRef", () => {
    expect(
      checkForwardRef(
        "export function Field({ ref, ...props }) { return <input {...props} ref={ref} />; }"
      )
    ).toEqual([]);
  });
});

// ─── R3: useEffect derived-state sync ────────────────────────────────────────

describe("checkUseEffectDerivedState", () => {
  it("flags single-setter useEffect", () => {
    const violations = checkUseEffectDerivedState(
      [
        "const [layout, setLayout] = useState(resolvedInitialLayout);",
        "",
        "useEffect(() => {",
        "  setLayout(resolvedInitialLayout);",
        "}, [resolvedInitialLayout]);",
      ].join("\n")
    );
    expect(violations.length).toBe(1);
    expect(violations[0]).toMatch(/setLayout/);
    expect(violations[0]).toMatch(/Derive during render/);
  });

  it("ignores multi-statement useEffect bodies", () => {
    const violations = checkUseEffectDerivedState(
      [
        "useEffect(() => {",
        "  setIsLoading(true);",
        "  void fetchData();",
        "}, [workspaceId]);",
      ].join("\n")
    );
    expect(violations).toEqual([]);
  });

  it("ignores files without useEffect", () => {
    expect(checkUseEffectDerivedState("const x = computed(a + b);")).toEqual(
      []
    );
  });
});

// ─── R4: Chart a11y ───────────────────────────────────────────────────────────

describe("checkChartA11y", () => {
  it("flags AreaChart without aria-hidden", () => {
    const violations = checkChartA11y(
      [
        `import { AreaChart } from "recharts";`,
        "<AreaChart data={data} />",
      ].join("\n")
    );
    expect(violations.some((v) => v.includes("AreaChart"))).toBe(true);
    expect(violations[0]).toMatch(/aria-hidden/);
  });

  it("passes when aria-hidden is present", () => {
    const violations = checkChartA11y(
      [
        `import { AreaChart } from "recharts";`,
        `<AreaChart aria-hidden="true" data={data} />`,
      ].join("\n")
    );
    expect(violations).toEqual([]);
  });

  it("flags BarChart without aria-hidden", () => {
    const violations = checkChartA11y(
      [
        `import { BarChart } from "recharts";`,
        `<BarChart data={series}><Bar dataKey="v" /></BarChart>`,
      ].join("\n")
    );
    expect(violations.some((v) => v.includes("BarChart"))).toBe(true);
  });

  it("ignores files without recharts import", () => {
    expect(checkChartA11y(`<AreaChart aria-hidden="true" />`)).toEqual([]);
  });
});

// ─── R5: Raw <img> ───────────────────────────────────────────────────────────

describe("checkRawImg", () => {
  it("flags <img> in production source", () => {
    const violations = checkRawImg(
      `<img src="/logo.png" alt="Afenda" />`,
      "packages/appshell/src/app-shell-header.tsx"
    );
    expect(violations.length).toBe(1);
    expect(violations[0]).toMatch(/next\/image/);
  });

  it("ignores <img> in story files", () => {
    const violations = checkRawImg(
      `<img src="/logo.png" alt="demo" />`,
      "packages/appshell/src/app-shell.stories.tsx"
    );
    expect(violations).toEqual([]);
  });

  it("ignores files without <img>", () => {
    expect(
      checkRawImg(
        `<Image src="/logo.png" alt="Afenda" width={40} height={40} />`
      )
    ).toEqual([]);
  });
});

// ─── R6: Module-level mutable state ──────────────────────────────────────────

describe("checkModuleMutableState", () => {
  it("flags let in a server-side file", () => {
    const violations = checkModuleMutableState(
      "let cachedLayout = null;\n\nexport async function getLayout() { return cachedLayout; }",
      "apps/erp/src/lib/workspace/layout-cache.ts"
    );
    expect(violations.length).toBe(1);
    expect(violations[0]).toMatch(/React\.cache/);
  });

  it("ignores let in a 'use client' file", () => {
    const violations = checkModuleMutableState(
      `"use client";\nlet counter = 0;`,
      "apps/erp/src/components/counter.client.tsx"
    );
    expect(violations).toEqual([]);
  });

  it("ignores const declarations (immutable)", () => {
    const violations = checkModuleMutableState(
      `const COLORS = ["red", "blue"] as const;`,
      "apps/erp/src/lib/chart-utils.ts"
    );
    expect(violations).toEqual([]);
  });

  it("ignores test files", () => {
    const violations = checkModuleMutableState(
      "let mockFn = vi.fn();",
      "apps/erp/src/__tests__/layout.test.ts"
    );
    expect(violations).toEqual([]);
  });
});

// ─── Aggregate ───────────────────────────────────────────────────────────────

describe("checkReactErpQuality", () => {
  it("accumulates violations from all rules", () => {
    const content = [
      `import { AreaChart } from "recharts";`,
      "const Field = forwardRef((props, ref) => <input ref={ref} />);",
      "<AreaChart data={data} />",
    ].join("\n");

    const violations = checkReactErpQuality(
      content,
      "packages/appshell/src/block.tsx"
    );
    expect(violations.some((v) => v.includes("recharts"))).toBe(true);
    expect(violations.some((v) => v.includes("forwardRef"))).toBe(true);
    expect(violations.some((v) => v.includes("AreaChart"))).toBe(true);
  });

  it("returns empty for fully compliant code", () => {
    const content = [
      `"use client";`,
      `import { useCallback } from "react";`,
      `export function Counter() { return <button type="button">+</button>; }`,
    ].join("\n");

    const violations = checkReactErpQuality(
      content,
      "apps/erp/src/components/counter.tsx"
    );
    expect(violations).toEqual([]);
  });
});
