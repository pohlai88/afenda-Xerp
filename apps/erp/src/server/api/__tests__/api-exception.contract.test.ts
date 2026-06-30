import { describe, expect, it } from "vitest";

import {
  assertGovernanceExceptionRecordShape,
  assertNoExpiredGovernanceExceptions,
  collectGovernanceExceptionViolations,
  defineGovernanceException,
  isGovernanceExceptionExpired,
} from "@/server/api/contracts/core";

const validException = defineGovernanceException({
  deferralKind: "validation-obligation",
  expiresAt: "2099-12-31T23:59:59.000Z",
  followUpEvidence:
    "docs/PAS/API-CONTRACT/SLICE/pas-api-001-s8-governance-exception-model.md",
  id: "exc.validation.example",
  owner: "platform-api-contract",
  riskReason: "Temporary validation deferral during migration bridge.",
});

describe("ApiGovernanceExceptionRecord", () => {
  it("requires owner and expiry on exception shape", () => {
    expect(() =>
      assertGovernanceExceptionRecordShape({
        ...validException,
        owner: "",
      })
    ).toThrow(/requires a named owner/);

    expect(() =>
      assertGovernanceExceptionRecordShape({
        ...validException,
        expiresAt: "not-a-date",
      })
    ).toThrow(/Invalid governance exception expiry/);
  });

  it("detects expired exceptions", () => {
    const expired = defineGovernanceException({
      ...validException,
      expiresAt: "2020-01-01T00:00:00.000Z",
      id: "exc.validation.expired",
    });

    expect(
      isGovernanceExceptionExpired(
        expired,
        new Date("2026-06-30T00:00:00.000Z")
      )
    ).toBe(true);

    const violations = collectGovernanceExceptionViolations(
      [expired],
      new Date("2026-06-30T00:00:00.000Z")
    );
    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatch(/expired at/);

    expect(() =>
      assertNoExpiredGovernanceExceptions(
        [expired],
        new Date("2026-06-30T00:00:00.000Z")
      )
    ).toThrow(/expired at/);
  });

  it("allows non-expired exceptions", () => {
    expect(() =>
      assertNoExpiredGovernanceExceptions(
        [validException],
        new Date("2026-06-30T00:00:00.000Z")
      )
    ).not.toThrow();
  });

  it("passes check:api-contracts gate when registry has no expired entries", async () => {
    const {
      API_GOVERNANCE_EXCEPTION_REGISTRY,
      collectGovernanceExceptionViolations,
    } = await import("@/server/api/contracts/core/api-exception.contract");

    expect(
      collectGovernanceExceptionViolations(API_GOVERNANCE_EXCEPTION_REGISTRY)
    ).toEqual([]);
  });
});
