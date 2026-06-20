import { describe, expect, it } from "vitest";
import { Button, cn } from "../index";

describe("@afenda/ui", () => {
  it("exports cn helper", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("exports Button from the public surface", () => {
    expect(Button).toBeTypeOf("function");
  });
});
