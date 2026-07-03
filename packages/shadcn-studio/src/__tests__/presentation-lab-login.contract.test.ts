import { describe, expect, it } from "vitest";

import {
  AUTH_PATTERN_IDS,
  AUTH_PATTERN_LAB_REGISTRY,
  getAuthPatternEntry,
  isAuthPatternId,
} from "../storybook/auth-pattern-lab.registry.js";
import {
  AUTH_PATTERN_TO_LOGIN_PATTERN,
  LOGIN_PATTERN_TO_AUTH_PATTERN,
  presentationLoginCopy,
} from "../storybook/presentation-lab/presentation-lab-login.contract.js";

describe("presentation-lab-login.contract", () => {
  it("uses quiet two-word editorial heroes", () => {
    expect(presentationLoginCopy["swiss-noir"].titleMuted).toBe("Sign");
    expect(presentationLoginCopy["swiss-noir"].titlePrimary).toBe("In");
    expect(presentationLoginCopy["verdant-milk-noir"].titleMuted).toBe("Performance");
    expect(presentationLoginCopy["verdant-milk-noir"].titlePrimary).toBe("Access");
    expect(presentationLoginCopy["verdant-portal-noir"].titleMuted).toBe("Performance");
    expect(presentationLoginCopy["verdant-portal-noir"].titlePrimary).toBe("Portal");
    expect(presentationLoginCopy["swiss-noir-operator-rail"].titleMuted).toBe(
      "Operator"
    );
    expect(presentationLoginCopy["swiss-noir-operator-rail"].titlePrimary).toBe(
      "Rail"
    );
  });

  it("keeps human form labels and shared sign-in CTA", () => {
    for (const pattern of [
      "swiss-noir",
      "verdant-milk-noir",
      "verdant-portal-noir",
      "swiss-noir-operator-rail",
    ] as const) {
      expect(presentationLoginCopy[pattern].emailLabel).toBe("Email");
      expect(presentationLoginCopy[pattern].passwordLabel).toBe("Password");
      expect(presentationLoginCopy[pattern].submitLabel).toBe("Sign in");
    }
  });

  it("uses one-line panel titles without proof metrics", () => {
    expect(presentationLoginCopy["swiss-noir"].panelTitle).toMatch(
      /Continue when you are ready/i
    );
    expect(presentationLoginCopy["verdant-milk-noir"].panelTitle).toMatch(
      /Present credentials when ready/i
    );
    expect(presentationLoginCopy["verdant-portal-noir"].panelTitle).toMatch(
      /Step through when credentials are set/i
    );
    expect(presentationLoginCopy["swiss-noir-operator-rail"].panelTitle).toMatch(
      /Authenticate when credentials are set/i
    );
    expect("proof" in presentationLoginCopy["swiss-noir"]).toBe(false);
  });

  it("keeps placeholders in contract SSOT", () => {
    for (const pattern of [
      "swiss-noir",
      "verdant-milk-noir",
      "verdant-portal-noir",
      "swiss-noir-operator-rail",
    ] as const) {
      expect(presentationLoginCopy[pattern].emailPlaceholder).toBe(
        "you@company.com"
      );
      expect(presentationLoginCopy[pattern].passwordPlaceholder).toMatch(/•+/);
    }
  });

  it("bridges auth registry IDs to login contract slugs", () => {
    expect(AUTH_PATTERN_TO_LOGIN_PATTERN["swiss-noir-verification-gate"]).toBe(
      "swiss-noir"
    );
    expect(AUTH_PATTERN_TO_LOGIN_PATTERN["verdant-milk-identity-vault"]).toBe(
      "verdant-milk-noir"
    );
    expect(AUTH_PATTERN_TO_LOGIN_PATTERN["verdant-centered-portal"]).toBe(
      "verdant-portal-noir"
    );
    expect(AUTH_PATTERN_TO_LOGIN_PATTERN["swiss-noir-operator-rail"]).toBe(
      "swiss-noir-operator-rail"
    );
    expect(LOGIN_PATTERN_TO_AUTH_PATTERN["swiss-noir"]).toBe(
      "swiss-noir-verification-gate"
    );
    expect(LOGIN_PATTERN_TO_AUTH_PATTERN["verdant-milk-noir"]).toBe(
      "verdant-milk-identity-vault"
    );
    expect(LOGIN_PATTERN_TO_AUTH_PATTERN["verdant-portal-noir"]).toBe(
      "verdant-centered-portal"
    );
    expect(LOGIN_PATTERN_TO_AUTH_PATTERN["swiss-noir-operator-rail"]).toBe(
      "swiss-noir-operator-rail"
    );
  });

  it("uses verification chamber chrome for swiss noir login", () => {
    expect(presentationLoginCopy["swiss-noir"].panelLabel).toBe(
      "Verification gate"
    );
    expect(presentationLoginCopy["swiss-noir"].verticalMark).toBe(
      "verify access"
    );
    expect(presentationLoginCopy["swiss-noir"].systemLine).toMatch(
      /sign in chamber/i
    );
  });

  it("uses identity vault chrome for verdant milk noir login", () => {
    expect(presentationLoginCopy["verdant-milk-noir"].panelLabel).toBe(
      "Identity vault"
    );
    expect(presentationLoginCopy["verdant-milk-noir"].verticalMark).toBe(
      "operator identity"
    );
    expect(presentationLoginCopy["verdant-milk-noir"].systemLine).toMatch(
      /identity vault/i
    );
    expect(presentationLoginCopy["verdant-milk-noir"].statusLabel).toBe(
      "sealed"
    );
  });

  it("uses centered portal chrome for verdant portal noir login", () => {
    expect(presentationLoginCopy["verdant-portal-noir"].panelLabel).toBe(
      "Access portal"
    );
    expect(presentationLoginCopy["verdant-portal-noir"].systemLine).toMatch(
      /access portal/i
    );
    expect(presentationLoginCopy["verdant-portal-noir"].statusLabel).toBe(
      "ready"
    );
  });

  it("uses operator rail readout chrome for swiss noir operator rail login", () => {
    expect(presentationLoginCopy["swiss-noir-operator-rail"].panelLabel).toBe(
      "Access rail"
    );
    expect(presentationLoginCopy["swiss-noir-operator-rail"].readoutTitle).toBe(
      "Ingress governance panel"
    );
    expect(
      presentationLoginCopy["swiss-noir-operator-rail"].governanceLines
    ).toHaveLength(4);
    expect(
      presentationLoginCopy["swiss-noir-operator-rail"].telemetryRows
    ).toHaveLength(3);
  });
});

describe("auth-pattern-lab.registry login entries", () => {
  it("registers primary login patterns at the top of the lab", () => {
    expect(AUTH_PATTERN_IDS[0]).toBe("swiss-noir-verification-gate");
    expect(AUTH_PATTERN_IDS[1]).toBe("verdant-milk-identity-vault");
    expect(AUTH_PATTERN_IDS[2]).toBe("verdant-centered-portal");
    expect(AUTH_PATTERN_IDS[3]).toBe("swiss-noir-operator-rail");
    expect(AUTH_PATTERN_LAB_REGISTRY).toHaveLength(10);
  });

  it("resolves quiet editorial login pattern entries", () => {
    expect(getAuthPatternEntry("swiss-noir-verification-gate").label).toBe(
      "Swiss Noir Sign In"
    );
    expect(getAuthPatternEntry("verdant-milk-identity-vault").label).toBe(
      "Verdant Milk Sign In"
    );
    expect(getAuthPatternEntry("verdant-centered-portal").label).toBe(
      "Verdant Centered Portal"
    );
    expect(getAuthPatternEntry("swiss-noir-operator-rail").label).toBe(
      "Swiss Noir Operator Rail"
    );
  });

  it("accepts login pattern ids in isAuthPatternId", () => {
    expect(isAuthPatternId("swiss-noir-verification-gate")).toBe(true);
    expect(isAuthPatternId("verdant-milk-identity-vault")).toBe(true);
    expect(isAuthPatternId("verdant-centered-portal")).toBe(true);
    expect(isAuthPatternId("swiss-noir-operator-rail")).toBe(true);
    expect(isAuthPatternId("unknown-pattern")).toBe(false);
  });
});
