import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  checkKernelContextSurface,
  formatKernelContextViolations,
} from "../check-kernel-context-surface.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-kernel-context-surface", () => {
  it("passes on the current repository state", () => {
    const violations = checkKernelContextSurface();

    expect(violations, formatKernelContextViolations(violations)).toEqual([]);
  });

  it("documents the consolidation stub in the support registry", () => {
    const violations = checkKernelContextSurface();
    const stubViolations = violations.filter(
      (v) => v.rule === "consolidation-stub-registry"
    );

    expect(stubViolations).toEqual([]);
  });

  it("requires registry exports on the kernel root barrel", () => {
    const violations = checkKernelContextSurface();
    const rootViolations = violations.filter(
      (v) => v.rule === "root-reexport-missing"
    );

    expect(rootViolations).toEqual([]);
  });
});
