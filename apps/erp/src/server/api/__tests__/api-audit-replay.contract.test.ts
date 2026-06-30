import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import { parseGovernedResponseMeta } from "@/server/api/contracts/api-envelope.contract";
import {
  API_ERROR_CODES,
  API_ERROR_DEFINITIONS,
  toGovernedErrorDoctrine,
} from "@/server/api/contracts/api-error.contract";
import {
  assertRegistryCorrelationPolicy,
  buildAuditReplayMinimumRecord,
  parseApiCorrelationIdentity,
  resolveCorrelationPolicy,
} from "@/server/api/contracts/core";

describe("ApiAuditReplayMinimumRecord", () => {
  it("documents readonly audit replay minimum fields", () => {
    const contract = API_CONTRACTS.find(
      (entry) => entry.id === "internal.v1.health.get"
    );
    expect(contract).toBeDefined();
    if (contract === undefined) {
      return;
    }

    const correlation = parseApiCorrelationIdentity({
      correlationId: "corr-health",
      requestId: "req-health",
    });

    const record = buildAuditReplayMinimumRecord({
      contract,
      correlation,
      recordedAt: "2026-06-30T12:00:00.000Z",
    });

    expect(record.operationId).toBe("internal.v1.health.get");
    expect(record.actorKind).toBe("anonymous");
    expect(record.contextPolicy).toBe("none");
    expect(record.lifecycle).toBe("active");
    expect(record.correlation).toEqual(correlation);
    expect(record.recordedAt).toBe("2026-06-30T12:00:00.000Z");
  });
});

describe("ApiCorrelationPolicy", () => {
  it("requires correlation on active governed operations", () => {
    for (const contract of API_CONTRACTS) {
      const policy = resolveCorrelationPolicy(contract);
      if (contract.lifecycle === "active") {
        expect(policy).toEqual({ kind: "required-for-governed-operation" });
      }
    }

    expect(() => assertRegistryCorrelationPolicy(API_CONTRACTS)).not.toThrow();
  });

  it("parses governed response meta trace identity", () => {
    const parsed = parseGovernedResponseMeta({
      correlationId: "corr-test",
      requestId: "req-test",
      timestamp: "2026-06-30T12:00:00.000Z",
    });

    expect(parsed.trace.correlationId).toBeDefined();
    expect(parsed.trace.requestId).toBeDefined();
  });
});

describe("ApiGovernedErrorDoctrine", () => {
  it("keeps family error doctrine style-agnostic", () => {
    for (const code of API_ERROR_CODES) {
      const doctrine = toGovernedErrorDoctrine(API_ERROR_DEFINITIONS[code]);
      expect(Object.keys(doctrine).sort()).toEqual([
        "category",
        "code",
        "logLevel",
        "publicMessage",
        "retryable",
      ]);
      expect("httpStatus" in doctrine).toBe(false);
    }
  });
});
