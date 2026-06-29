# Checkpoint schema — PAS kernel audit

Path: `.cursor/audit/checkpoints/{PAS-ID}.json`

Example: `.cursor/audit/checkpoints/PAS-001.json`, `PAS-001A.json`, or `PAS-001B.json`

---

## JSON shape

```json
{
  "pasId": "PAS-001B",
  "auditCatalog": "docs/PAS/KERNEL/audit/PAS-001B.md",
  "authorityPas": "docs/PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md",
  "startedAt": "2026-06-30T00:00:00Z",
  "updatedAt": "2026-06-30T00:00:00Z",
  "currentWave": "W3",
  "repairRound": 1,
  "maxIterations": 3,
  "repairMode": "audit-only-first",
  "verdicts": {
    "PAS-001B-AUD-01": "Conditional Pass",
    "PAS-001B-AUD-02": "Pass"
  },
  "clusters": {
    "C1": {
      "signature": "doc-status-drift",
      "audIds": ["PAS-001B-AUD-01", "PAS-001B-AUD-28"],
      "status": "open",
      "files": ["docs/PAS/pas-status-index.md"]
    }
  },
  "completedWaves": ["W1", "W2"],
  "gateEvidenceRef": ".cursor/audit/checkpoints/PAS-001B-gates-W8.txt",
  "finalConfidence": null
}
```

---

## Resume rules

| Field | Resume behavior |
| --- | --- |
| `verdicts` Pass | Skip re-audit for that AUD-ID |
| `verdicts` Conditional/Fail | Re-audit after repair cluster closed |
| `completedWaves` | Skip entire wave if all AUDs Pass |
| `currentWave` | Continue from next incomplete wave |
| `repairRound` | Increment after repair + partial re-audit |

---

## Parent agent actions

1. Write checkpoint after every wave merge.
2. On resume: read checkpoint → skip Pass AUDs → continue `currentWave`.
3. Attach `gateEvidenceRef` file path when W8/W9 need shell proof.

---

## Completion

Set `finalConfidence` to score string from final AUD (e.g. `"92%"`) when AUD-30 / AUD-25 completes.
