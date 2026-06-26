import { describe, expect, it } from "vitest";

import { readAuthRuntimeEnv } from "../auth.env-reader.js";

describe("readAuthRuntimeEnv", () => {
  it("returns the provided env slice without requiring ProcessEnv keys", () => {
    const slice = { NODE_ENV: "test" } as const;

    expect(readAuthRuntimeEnv(slice)).toBe(slice);
  });

  it("defaults to the runtime process env bag", () => {
    expect(readAuthRuntimeEnv()).toBe(process.env);
  });
});
