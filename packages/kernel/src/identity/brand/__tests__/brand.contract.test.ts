import { describe, expect, it } from "vitest";

import {
  type Brand as IdentityBarrelBrand,
  unbrand as identityBarrelUnbrand,
} from "../../index.js";
import { type Brand, unbrand } from "../index.js";

describe("brand contract (PAS-001 §4.1.2)", () => {
  it("unbrand returns the same string value", () => {
    type SampleBrand = Brand<string, "SampleBrand">;
    const branded = "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV" as SampleBrand;

    expect(unbrand(branded)).toBe("ten_01ARZ3NDEKTSV4RRFFQ69G5FAV");
  });

  it("JSON.stringify of branded value serializes as plain string", () => {
    type SampleBrand = Brand<string, "SampleBrand">;
    const branded = "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV" as SampleBrand;

    expect(JSON.stringify({ id: branded })).toBe(
      '{"id":"ten_01ARZ3NDEKTSV4RRFFQ69G5FAV"}'
    );
    expect(JSON.parse(JSON.stringify({ id: branded }))).toEqual({
      id: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
    });
  });

  it("exports Brand type and unbrand from the identity barrel", () => {
    type SampleBrand = IdentityBarrelBrand<string, "SampleBrand">;
    const branded = "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV" as SampleBrand;

    expect(identityBarrelUnbrand(branded)).toBe(
      "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV"
    );
  });

  it("unbrand is identity — no copy or transform", () => {
    type SampleBrand = Brand<string, "SampleBrand">;
    const branded = "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV" as SampleBrand;

    expect(unbrand(branded)).toBe(branded);
    expect(Object.is(unbrand(branded), branded)).toBe(true);
  });
});
