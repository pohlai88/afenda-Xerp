import { describe, expect, it } from "vitest";

import {
  BETTER_AUTH_BOUNDARY_POLICY as kernelBetterAuthPolicy,
  brandCustomerWireReference as kernelBrandCustomerWireReference,
  parseAuthActorIdentity as kernelParseAuthActorIdentity,
  parseAuthSubjectId as kernelParseAuthSubjectId,
  serializeAuthActorIdentity as kernelSerializeAuthActorIdentity,
  toAuthSubjectId as kernelToAuthSubjectId,
} from "../../../index.js";
import { BETTER_AUTH_BOUNDARY_POLICY as governanceBetterAuthPolicy } from "../../governance/index.js";
import {
  BETTER_AUTH_BOUNDARY_POLICY,
  brandCustomerWireReference,
  parseAuthActorIdentity,
  parseAuthSubjectId,
  serializeAuthActorIdentity,
  toAuthSubjectId,
} from "../../index.js";
import {
  brandCustomerWireReference as wireBrandCustomerWireReference,
  parseAuthSubjectId as wireParseAuthSubjectId,
} from "../index.js";

describe("wire public export parity (PAS-001 §4.1.7 / §4.1.9 / §4.1.11)", () => {
  it("re-exports auth wire ingress from the identity barrel", () => {
    const subject = parseAuthSubjectId("auth_user_1");
    expect(toAuthSubjectId(subject)).toBe("auth_user_1");

    const identity = parseAuthActorIdentity({
      authSubjectId: "auth_user_1",
    });
    expect(serializeAuthActorIdentity(identity)).toEqual({
      authSubjectId: "auth_user_1",
    });
  });

  it("re-exports auth wire ingress from the @afenda/kernel root barrel", () => {
    const subject = kernelParseAuthSubjectId("auth_user_1");
    expect(kernelToAuthSubjectId(subject)).toBe("auth_user_1");

    const identity = kernelParseAuthActorIdentity({
      authSubjectId: "auth_user_1",
    });
    expect(kernelSerializeAuthActorIdentity(identity)).toEqual({
      authSubjectId: "auth_user_1",
    });
  });

  it("re-exports wire barrel symbols from identity and root", () => {
    expect(wireParseAuthSubjectId).toBe(parseAuthSubjectId);
    expect(kernelParseAuthSubjectId).toBe(parseAuthSubjectId);
    expect(wireBrandCustomerWireReference).toBe(brandCustomerWireReference);
    expect(kernelBrandCustomerWireReference).toBe(brandCustomerWireReference);
  });

  it("re-exports Better Auth governance policy from identity and root", () => {
    expect(BETTER_AUTH_BOUNDARY_POLICY.approvedAuthSubjectIngress).toBe(
      "parseAuthSubjectId"
    );
    expect(governanceBetterAuthPolicy).toBe(BETTER_AUTH_BOUNDARY_POLICY);
    expect(kernelBetterAuthPolicy).toBe(BETTER_AUTH_BOUNDARY_POLICY);
  });
});
