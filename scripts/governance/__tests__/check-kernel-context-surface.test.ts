import { describe, expect, it } from "vitest";

import {
  checkKernelContextSurface,
  ensureKernelDistFresh,
  formatKernelContextViolations,
} from "../check-kernel-context-surface.mts";

describe("check-kernel-context-surface", () => {
  it("passes on the current repository state", () => {
    ensureKernelDistFresh();
    const violations = checkKernelContextSurface();

    expect(violations, formatKernelContextViolations(violations)).toEqual([]);
  });

  it("documents the consolidation stub in the support registry", () => {
    ensureKernelDistFresh();
    const violations = checkKernelContextSurface();
    const stubViolations = violations.filter(
      (v) => v.rule === "consolidation-stub-registry"
    );

    expect(stubViolations).toEqual([]);
  });

  it("requires registry exports on the kernel root barrel", () => {
    ensureKernelDistFresh();
    const violations = checkKernelContextSurface();
    const rootViolations = violations.filter(
      (v) => v.rule === "root-reexport-missing"
    );

    expect(rootViolations).toEqual([]);
  });
});
