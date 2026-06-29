# PAS-API-AGENT-001 — Agent / Tool API Binding Standard

> **Style binding under:** [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) · **Status: Reserved**

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-API-AGENT-001 |
| **Maturity** | Planned (reserved) |
| **Last reviewed** | 2026-06-30 |

---

# 1. Binding Scope (when activated)

| Area | Authority |
| --- | --- |
| Tool/action contract | Action name, input, output, side-effect class |
| Human approval policy | Which operations require confirmation |
| Agent safety boundary | No ungoverned destructive action |
| Audit replay | Prompt/request/action/result trace |
| Idempotency | Safe re-run policy |
| Tool publication | Agent-readable catalog |

**Stance:** Use when agents execute governed ERP operations — not for ungoverned automation shortcuts.

---

# 2. References

| Artifact | Path |
| --- | --- |
| Root authority | [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
