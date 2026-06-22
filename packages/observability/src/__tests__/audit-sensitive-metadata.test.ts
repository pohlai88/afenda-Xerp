import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  AuditValidationError,
  FORBIDDEN_AUDIT_METADATA_KEYS,
  assertAuditMetadata,
  buildAuditEventRow,
} from "../index.js";

const packageRoot = fileURLToPath(new URL("../..", import.meta.url));

describe("sensitive audit metadata policy", () => {
  it("blocks every FORBIDDEN_AUDIT_METADATA_KEYS entry case-insensitively", () => {
    for (const key of FORBIDDEN_AUDIT_METADATA_KEYS) {
      expect(() =>
        assertAuditMetadata({ [key]: "blocked-value" })
      ).toThrow(AuditValidationError);

      expect(() =>
        assertAuditMetadata({ [key.toUpperCase()]: "blocked-value" })
      ).toThrow(AuditValidationError);
    }
  });

  it("blocks sensitive key patterns such as refresh_token", () => {
    expect(() =>
      assertAuditMetadata({ oauth_refresh_token: "secret" })
    ).toThrow(AuditValidationError);
  });

  it("rejects forbidden metadata when building audit rows", () => {
    expect(() =>
      buildAuditEventRow({
        actorType: "user",
        module: "auth",
        action: "session.created",
        targetType: "session",
        result: "success",
        correlationId: "corr-sensitive-001",
        metadata: { password: "blocked" },
      })
    ).toThrow(AuditValidationError);
  });

  it("keeps validation wired to the policy contract module", () => {
    const validationSource = readFileSync(
      join(packageRoot, "src/audit-event.validation.ts"),
      "utf8"
    );
    const policySource = readFileSync(
      join(packageRoot, "src/contracts/audit-policy.contract.ts"),
      "utf8"
    );

    expect(validationSource).toContain("FORBIDDEN_AUDIT_METADATA_KEYS");
    expect(validationSource).toContain("SENSITIVE_METADATA_KEY_PATTERN");
    expect(policySource).toContain("FORBIDDEN_AUDIT_METADATA_KEYS");
  });
});
