import { describe, expect, it } from "vitest";

import { readRuntimeEnvSource } from "@/lib/env/env-reader-source";

describe("readRuntimeEnvSource", () => {
  it("returns the provided env slice without requiring ProcessEnv keys", () => {
    const slice = {
      AFENDA_AUTH_SECURITY_REVIEW_ON_PASSWORDLESS: "true",
    } as const;

    expect(readRuntimeEnvSource(slice)).toBe(slice);
  });

  it("defaults to the runtime process env bag", () => {
    expect(readRuntimeEnvSource()).toBe(process.env);
  });
});
