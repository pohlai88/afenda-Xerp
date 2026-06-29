# PAS-API-EVENT-001 — Event API Binding Standard

> **Style binding under:** [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) · **Status: Reserved**

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-API-EVENT-001 |
| **Maturity** | Planned (reserved) |
| **Last reviewed** | 2026-06-30 |

---

# 1. Binding Scope (when activated)

| Area | Authority |
| --- | --- |
| Event contract identity | Event name, version, producer, consumer |
| Payload schema | Event message shape |
| Delivery semantics | At-least-once, exactly-once claim, ordering limits |
| Idempotency | Consumer replay safety |
| Event lifecycle | Active, deprecated, retired |
| Consumer impact | Downstream migration |
| Replay policy | Audit and rebuild requirements |

**Stance:** Use for asynchronous integration — not synchronous UI request/response.

---

# 2. References

| Artifact | Path |
| --- | --- |
| Root authority | [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
