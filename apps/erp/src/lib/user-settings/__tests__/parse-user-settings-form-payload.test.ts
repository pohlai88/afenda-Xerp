import { describe, expect, it } from "vitest";

import { parseFormDataJsonField } from "../parse-user-settings-form-payload";

describe("parseFormDataJsonField", () => {
  it("parses a valid JSON string field", () => {
    const formData = new FormData();
    formData.set("payload", JSON.stringify({ theme: "dark" }));

    expect(parseFormDataJsonField(formData, "payload")).toEqual({
      theme: "dark",
    });
  });

  it("returns undefined for missing, empty, or invalid JSON fields", () => {
    const missingField = new FormData();
    expect(parseFormDataJsonField(missingField, "payload")).toBeUndefined();

    const emptyField = new FormData();
    emptyField.set("payload", "");
    expect(parseFormDataJsonField(emptyField, "payload")).toBeUndefined();

    const invalidJson = new FormData();
    invalidJson.set("payload", "{not-json");
    expect(parseFormDataJsonField(invalidJson, "payload")).toBeUndefined();

    const nonString = new FormData();
    nonString.set("payload", new Blob(["{}"]));
    expect(parseFormDataJsonField(nonString, "payload")).toBeUndefined();
  });
});
