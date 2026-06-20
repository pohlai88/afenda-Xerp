import { describe, expect, it } from "vitest";
import {
  createExecutionFailure,
  createExecutionSuccess,
  isExecutionSuccess,
} from "../index.js";

describe("execution result validation", () => {
  it("creates success results", () => {
    const result = createExecutionSuccess({ executionId: "exec-1" });

    expect(result.status).toBe("success");
    expect(isExecutionSuccess(result)).toBe(true);

    if (isExecutionSuccess(result)) {
      expect(result.value.executionId).toBe("exec-1");
    }
  });

  it("creates failure results", () => {
    const result = createExecutionFailure(
      "workflow_not_registered",
      "Workflow missing."
    );

    expect(result.status).toBe("workflow_not_registered");
    expect(isExecutionSuccess(result)).toBe(false);
    expect(result.error.message).toBe("Workflow missing.");
  });
});
