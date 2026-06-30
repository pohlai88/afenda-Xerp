import { describe, expect, it } from "vitest";

import {
  API_ROUTE_CATALOG_DRIFT_STALE_MESSAGE,
  checkApiRouteCatalogDrift,
  compareApiRouteCatalogSnapshot,
} from "../check-api-route-catalog.mts";
import {
  checkOpenapiDrift,
  compareOpenapiSnapshot,
  OPENAPI_DRIFT_STALE_MESSAGE,
} from "../check-openapi-drift.mts";

describe("check-openapi-drift gate probes", () => {
  it("passes when live document matches snapshot", () => {
    const document = { openapi: "3.1.0", info: { title: "test" } };

    expect(compareOpenapiSnapshot(document, document)).toEqual({ ok: true });
    expect(() =>
      checkOpenapiDrift({ liveDocument: document, snapshot: document })
    ).not.toThrow();
  });

  it("throws when tampered snapshot diverges from live document", () => {
    const liveDocument = { openapi: "3.1.0", info: { title: "live" } };
    const tamperedSnapshot = { openapi: "3.1.0", info: { title: "stale" } };

    expect(compareOpenapiSnapshot(liveDocument, tamperedSnapshot)).toEqual({
      ok: false,
      message: OPENAPI_DRIFT_STALE_MESSAGE,
    });

    expect(() =>
      checkOpenapiDrift({
        liveDocument,
        snapshot: tamperedSnapshot,
      })
    ).toThrow(OPENAPI_DRIFT_STALE_MESSAGE);
  });
});

describe("check-api-route-catalog gate probes", () => {
  it("passes when live catalog matches snapshot", () => {
    const catalog = {
      generatedAt: "2026-06-30T00:00:00.000Z",
      routes: [{ id: "internal.v1.health.get" }],
    };

    expect(compareApiRouteCatalogSnapshot(catalog, catalog)).toEqual({
      ok: true,
    });
    expect(() =>
      checkApiRouteCatalogDrift({ liveCatalog: catalog, snapshot: catalog })
    ).not.toThrow();
  });

  it("throws when tampered route catalog snapshot diverges", () => {
    const liveCatalog = {
      generatedAt: "2026-06-30T00:00:00.000Z",
      routes: [{ id: "internal.v1.health.get" }],
    };
    const tamperedSnapshot = {
      generatedAt: "2026-06-30T00:00:00.000Z",
      routes: [{ id: "internal.v1.removed.get" }],
    };

    expect(
      compareApiRouteCatalogSnapshot(liveCatalog, tamperedSnapshot)
    ).toEqual({
      ok: false,
      message: API_ROUTE_CATALOG_DRIFT_STALE_MESSAGE,
    });

    expect(() =>
      checkApiRouteCatalogDrift({
        liveCatalog,
        snapshot: tamperedSnapshot,
      })
    ).toThrow(API_ROUTE_CATALOG_DRIFT_STALE_MESSAGE);
  });
});
