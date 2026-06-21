import { describe, expect, it } from "vitest";
import {
  createMetadataGovernanceError,
  isMetadataGovernanceError,
  MetadataGovernanceError,
} from "../metadata.errors.js";

describe("MetadataGovernanceError", () => {
  it("creates a typed metadata governance error", () => {
    const error = new MetadataGovernanceError({
      code: "metadata-governance.invalid-governed-array",
      message: "Invalid governed array.",
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(MetadataGovernanceError);
    expect(error.name).toBe("MetadataGovernanceError");
    expect(error.code).toBe("metadata-governance.invalid-governed-array");
    expect(error.message).toBe("Invalid governed array.");
  });

  it("supports serializable diagnostic context", () => {
    const error = new MetadataGovernanceError({
      code: "metadata-governance.duplicate-governed-value",
      message: "Duplicate governed value.",
      context: {
        value: "grid",
      },
    });

    expect(error.toJSON()).toEqual({
      name: "MetadataGovernanceError",
      code: "metadata-governance.duplicate-governed-value",
      message: "Duplicate governed value.",
      context: {
        value: "grid",
      },
    });
  });

  it("supports native cause", () => {
    const cause = new Error("Original error.");

    const error = new MetadataGovernanceError({
      code: "metadata-governance.cross-package-violation",
      message: "Cross-package violation.",
      cause,
    });

    expect(error.cause).toBe(cause);
  });

  it("detects metadata governance errors", () => {
    const error = createMetadataGovernanceError({
      code: "metadata-governance.prohibited-ownership",
      message: "Prohibited ownership.",
    });

    expect(isMetadataGovernanceError(error)).toBe(true);
    expect(isMetadataGovernanceError(new Error("Nope."))).toBe(false);
    expect(isMetadataGovernanceError(null)).toBe(false);
  });
});
