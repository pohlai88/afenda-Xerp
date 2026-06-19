import { afterEach, describe, expect, it } from "vitest";

import {
  assertBootstrapAllowed,
  assertSeedProfileAllowed,
  BootstrapSafetyError,
  isProductionEnvironment,
  SeedSafetyError,
} from "../seeds/seed-environment.js";

describe("seed environment safety", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("allows platform seed outside production", () => {
    process.env.NODE_ENV = "development";
    expect(() => assertSeedProfileAllowed("platform")).not.toThrow();
    expect(() => assertSeedProfileAllowed("dev")).not.toThrow();
  });

  it("blocks dev seeds in production", () => {
    process.env.NODE_ENV = "production";
    expect(isProductionEnvironment()).toBe(true);
    expect(() => assertSeedProfileAllowed("dev")).toThrow(SeedSafetyError);
    expect(() => assertSeedProfileAllowed("demo")).toThrow(SeedSafetyError);
    expect(() => assertSeedProfileAllowed("preview")).toThrow(SeedSafetyError);
  });

  it("requires explicit confirmation for production platform seed", () => {
    process.env.NODE_ENV = "production";
    delete process.env.AFENDA_SEED_CONFIRM;

    expect(() => assertSeedProfileAllowed("platform")).toThrow(SeedSafetyError);

    process.env.AFENDA_SEED_CONFIRM = "yes";
    expect(() => assertSeedProfileAllowed("platform")).not.toThrow();
  });

  it("requires explicit confirmation for production bootstrap", () => {
    process.env.NODE_ENV = "production";
    delete process.env.AFENDA_BOOTSTRAP_CONFIRM;

    expect(() => assertBootstrapAllowed("local")).toThrow(BootstrapSafetyError);

    process.env.AFENDA_BOOTSTRAP_CONFIRM = "yes";
    expect(() => assertBootstrapAllowed("preview")).not.toThrow();
  });
});
