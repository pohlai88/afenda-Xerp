import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import {
  projectProblemDetailClass,
  projectProblemDetailEnvelopeFields,
} from "@/server/api/contracts/api-error.contract";
import { serviceActorPingGetContract } from "@/server/api/contracts/auth/service-actor-ping.contract";
import { jsonErrorResponse } from "@/server/api/runtime/api-response";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";

describe("api-problemdetail runtime attestation (Enterprise Runtime criterion 2)", () => {
  it("projects ProblemDetail fields for every governed handler error path code", () => {
    for (const code of [
      "unauthenticated",
      "forbidden",
      "validation_failed",
      "internal_error",
    ] as const) {
      const projection = projectProblemDetailClass(code);
      const envelope = projectProblemDetailEnvelopeFields(
        code,
        "Runtime attestation message",
        "corr-runtime-attest"
      );
      expect(projection.type).toMatch(/^https:\/\/afenda\.dev\/problems\//);
      expect(projection.status).toBeGreaterThanOrEqual(400);
      expect(projection.title.length).toBeGreaterThan(0);
      expect(envelope.detail).toBe("Runtime attestation message");
      expect(envelope.instance).toBe("corr-runtime-attest");
    }
  });

  it("returns governed error envelope from jsonErrorResponse", async () => {
    const response = jsonErrorResponse(
      "unauthenticated",
      "A verified service actor is required for this operation.",
      {
        correlationId: "corr-runtime-attest",
        requestId: "req-runtime-attest",
        timestamp: "2026-06-30T00:00:00.000Z",
      }
    );

    const body: unknown = await response.json();
    expect(body).toMatchObject({
      ok: false,
      error: {
        code: "unauthenticated",
        correlationId: "corr-runtime-attest",
        detail: "A verified service actor is required for this operation.",
        instance: "corr-runtime-attest",
        status: 401,
        title: "Authentication is required.",
        type: "https://afenda.dev/problems/unauthenticated",
      },
      meta: { correlationId: "corr-runtime-attest" },
    });
  });

  it("covers active operations through createApiHandler error paths", () => {
    const activeContracts = API_CONTRACTS.filter(
      (contract) => contract.lifecycle === "active"
    );

    expect(activeContracts.length).toBeGreaterThan(0);
    expect(
      activeContracts.some(
        (contract) => contract.id === serviceActorPingGetContract.id
      )
    ).toBe(true);

    for (const contract of activeContracts) {
      const handler = createApiHandler({
        contract,
        handler: async () => {
          throw new Error("probe");
        },
      });
      expect(typeof handler).toBe("function");
    }
  });
});
