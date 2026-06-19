import { describe, expect, it } from "vitest";

import {
  buildMigrationLedgerExpectations,
  detectMigrationLedgerDrift,
} from "../migrations/ledger.contract.js";

describe("migration ledger contract", () => {
  it("detects database-only migration hashes", () => {
    const journalEntries = [
      {
        idx: 0,
        tag: "20260619181744_great_robbie_robertson",
        when: 1,
        hash: "a".repeat(64),
        sqlPath: "ignored.sql",
      },
    ];

    const expectedRows = buildMigrationLedgerExpectations(journalEntries, 0);
    const drift = detectMigrationLedgerDrift(
      journalEntries,
      [
        {
          id: 1,
          hash: "b".repeat(64),
          createdAt: 1,
        },
      ],
      expectedRows
    );

    expect(drift.some((issue) => issue.code === "db_only_hash")).toBe(true);
  });

  it("reports an in-sync ledger as clean", () => {
    const hash = "c".repeat(64);
    const journalEntries = [
      {
        idx: 0,
        tag: "20260619181744_great_robbie_robertson",
        when: 1,
        hash,
        sqlPath: "ignored.sql",
      },
    ];
    const expectedRows = buildMigrationLedgerExpectations(journalEntries, 0);

    const drift = detectMigrationLedgerDrift(
      journalEntries,
      [{ id: 1, hash, createdAt: 1 }],
      expectedRows
    );

    expect(drift).toEqual([]);
  });
});
