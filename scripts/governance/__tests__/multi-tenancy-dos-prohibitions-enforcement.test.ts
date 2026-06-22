import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { collectForbiddenAccountingViolations } from "../lib/multi-tenancy-dos-prohibitions-enforcement.mts";
import {
  sourceContainsCodePattern,
  sourceContainsForbiddenAny,
  stripCommentsAndStringLiterals,
} from "../lib/multi-tenancy-scan-utils.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("multi-tenancy-scan-utils", () => {
  it("ignores : any in line comments", () => {
    const source = `
      // Do not use : any in authority surfaces
      const value: string = "ok";
    `;

    expect(sourceContainsForbiddenAny(source)).toBe(false);
  });

  it("ignores accounting patterns in string literals", () => {
    const source = `
      const message = "journal.post is prohibited";
      export function ok() { return message; }
    `;

    expect(sourceContainsCodePattern(source, /journal\.post/i)).toBe(false);
  });

  it("detects : any in executable code", () => {
    const source = `
      function broken(input: any) {
        return input;
      }
    `;

    expect(sourceContainsForbiddenAny(source)).toBe(true);
  });

  it("detects accounting patterns in executable code", () => {
    const source = `
      export async function postJournal() {
        return journal.post();
      }
    `;

    expect(sourceContainsCodePattern(source, /journal\.post/i)).toBe(true);
  });

  it("strips block comments before pattern matching", () => {
    const source = `
      /*
        insertJournal stub — not implemented
      */
      export const ready = true;
    `;

    expect(stripCommentsAndStringLiterals(source)).not.toContain("insertJournal");
    expect(sourceContainsCodePattern(source, /insertJournal/i)).toBe(false);
  });
});

describe("collectForbiddenAccountingViolations", () => {
  it("returns no violations on the current repository", () => {
    expect(collectForbiddenAccountingViolations(repoRoot)).toEqual([]);
  });
});
