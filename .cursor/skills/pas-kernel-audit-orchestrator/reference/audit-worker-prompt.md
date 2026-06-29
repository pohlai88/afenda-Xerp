# Audit worker Task prompt template

Use for each parallel AUD Task. Parent agent fills `{PLACEHOLDERS}`.

---

## Task configuration

```text
subagent_type: explore  (or resume @pas-kernel-audit-worker)
readonly: true
description: PAS-001B AUD-{NN} {slice-short-name}
```

---

## Prompt body

```text
You are a PAS kernel audit worker. Read-only — do not edit files.

Authority PAS (§0 only): {AUTHORITY_PAS_PATH}
Audit catalog: {AUDIT_CATALOG_PATH}
Assigned slice: PAS-001X-AUD-{NN}

## Assigned AUD section (execute only this slice)

{PASTE_AUD_SECTION_FROM_CATALOG}

## Required output format

{PASTE_OUTPUT_FORMAT_FROM_CATALOG}

## Gate evidence (if provided — cite in Evidence inspected)

{PASTE_GATE_STDOUT_OR_NONE}

## Rules

1. Collect code, doc, registry, export, gate, boundary, and test evidence listed in the AUD section.
2. Verdict must be Pass | Conditional Pass | Fail | Not Applicable — never TBD.
3. No slice Pass from PAS wording alone — require live evidence.
4. Do not implement fixes — list Required remediation only.
5. Do not audit other AUD slices.
6. Do not run shell gates — use pasted gate output or note "Gate evidence not supplied".

Return only the formatted audit report for this single AUD slice.
```

---

## Parent responsibilities before spawn

1. Read catalog; extract AUD-{NN} section (lines for that heading only).
2. If wave requires gates, run shell commands first; paste stdout.
3. Verify AUD-{NN} not already Pass in checkpoint.
4. Launch ≤4 Tasks in one turn.

---

## Example (PAS-001B AUD-05)

```text
description: PAS-001B AUD-05 28/28 module catalog

Assigned slice: PAS-001B-AUD-05
Primary paths: packages/kernel/src/erp-domain/**, erp-domain-layout.contract.ts

Inspect: 28/28 delivered wire modules vs layout contract.
Verdict against Pass/Fail criteria in AUD section only.
```
