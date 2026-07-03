import { describe, expect, it } from "vitest";

import {
  type AcceptanceRecordWire,
  isAcceptanceRecordWire,
} from "../meta-contracts/acceptance-record.contract.js";
import { validateAcceptanceRecordSeal } from "../meta-contracts/acceptance-record.validator.js";
import { resolveGovernedBlockAcceptanceRecordId } from "../meta-contracts/block-metadata.builders.js";
import {
  ACCEPTANCE_RECORD_REGISTRY,
  assertAllAcceptanceRecordsSealed,
  getAcceptanceRecordByBlockId,
  listAcceptanceRecordIds,
} from "../meta-registry/acceptance-record.registry.js";
import { GOVERNED_BLOCK_CONTRACT_IDS } from "../meta-registry/block-slot.registry.js";

describe("acceptance record registry (PAS-006C governed blocks)", () => {
  it("seals every governed block contract id", () => {
    expect(listAcceptanceRecordIds()).toHaveLength(
      GOVERNED_BLOCK_CONTRACT_IDS.length
    );

    for (const blockId of GOVERNED_BLOCK_CONTRACT_IDS) {
      const record = getAcceptanceRecordByBlockId(blockId);

      expect(record.acceptanceRecordId).toBe(
        resolveGovernedBlockAcceptanceRecordId(blockId)
      );
      expect(record.blockId).toBe(blockId);
      expect(isAcceptanceRecordWire(record)).toBe(true);
      expect(validateAcceptanceRecordSeal(record).ok).toBe(true);
    }
  });

  it("registry entries are JSON-serializable", () => {
    for (const recordId of listAcceptanceRecordIds()) {
      const record = ACCEPTANCE_RECORD_REGISTRY[recordId];
      expect(() => JSON.stringify(record)).not.toThrow();

      const parsed: unknown = JSON.parse(JSON.stringify(record));
      expect(isAcceptanceRecordWire(parsed)).toBe(true);
    }
  });

  it("assertAllAcceptanceRecordsSealed passes", () => {
    expect(() => assertAllAcceptanceRecordsSealed()).not.toThrow();
  });

  it("marks auth-adjacent ingress blocks with WCAG seals", () => {
    const authAdjacent = GOVERNED_BLOCK_CONTRACT_IDS.filter(
      (blockId) => getAcceptanceRecordByBlockId(blockId).wcagAaAuthAdjacent
    );

    expect(authAdjacent).toEqual([
      "login-page-04",
      "verify-email-page-01",
      "verify-email-sent-page-01",
      "verify-email-expired-page-01",
      "verify-email-success-page-01",
      "invite-page-01",
      "invite-accept-page-01",
      "invite-expired-page-01",
      "invite-invalid-page-01",
      "invite-consumed-page-01",
      "invite-email-mismatch-page-01",
      "passkey-page-01",
      "error-passkey-page-01",
      "sso-page-01",
      "error-sso-page-01",
      "error-oauth-page-01",
      "otp-page-01",
      "mfa-page-01",
      "mfa-recovery-page-01",
      "error-session-expired-page-01",
      "error-access-denied-page-01",
      "security-review-page-01",
      "error-authentication-page-01",
    ]);
  });

  it("registry keys match acceptance record ids", () => {
    const records = Object.values(
      ACCEPTANCE_RECORD_REGISTRY
    ) as AcceptanceRecordWire[];

    expect(records.map((record) => record.acceptanceRecordId).sort()).toEqual(
      listAcceptanceRecordIds()
    );
  });
});
