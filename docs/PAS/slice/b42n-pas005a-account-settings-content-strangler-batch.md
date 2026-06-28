# Slice B42n — Account Settings Content Strangler Batch (PAS-005A §14)

**Prerequisite:** B42m delivered — marketing/auth/chart/statistics strangler wrappers; account-settings shell blocks (01–07) remain afenda-only in main wrapper registry

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — wires ~23 account-settings content parity rows to afenda-only strangler wrappers; preserves ERP slot-prop shell compositions

**Clean Core impact:** A→A — content wrappers delegate to existing governed blocks under `presentation/blocks/`; no MCP TSX copy; no auth-style ERP injection changes

## Handoff block

```
Handoff from: docs/PAS/slice/b42n-pas005a-account-settings-content-strangler-batch.md

1. Objective    — Create afenda-only presentation MCP wrappers for all account-settings content parity rows (~23 slices across 01–07 plus panel-section); add serializable content sub-registry; update studio-block-parity.registry wrapperPath columns; preserve AppShellAccountSettings01–07 shell prop contracts and @afenda/appshell public exports.
2. Allowed layer— packages/appshell/src/presentation/wrappers/account-settings/** · packages/appshell/src/presentation/wrappers/presentation-mcp-account-settings-content.registry.ts · packages/appshell/src/__tests__/** · packages/shadcn-studio/src/registry/studio-block-parity.registry.ts · docs/PAS/slice/b42n-*.md · docs/PAS/pas-status-index.md · docs/PAS/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (§14 row)
3. Files        — account-settings/content/**/*.wrapper.tsx (23) · presentation-mcp-account-settings-content.registry.ts · presentation-mcp-wrapper-b42n.test.ts · presentation-mcp-wrapper.registry.test.ts (aggregate) · studio-block-parity.registry.ts · slice doc · pas-status-index · PAS-005A §14
4. Prohibited   — foundation-disposition.registry.ts · replace account-settings with raw MCP blocks · copy MCP TSX into appshell · break AppShellAccountSettings01–07 prop types or ERP tests · change index.ts public exports unless thin re-export required
5. Authority    — PAS-005A · ADR-0017 · Governed UI consumer rules · B42i/B42m strangler registry · account-settings governed blocks under presentation/blocks/
6. Gates        —
   pnpm --filter @afenda/shadcn-studio build
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run -- account-settings
   pnpm --filter @afenda/appshell test:run
   pnpm quality:boundaries
   pnpm ui:guard:scan
7. Closes       — 23 content strangler wrappers · content sub-registry + summary helper · parity wrapperPath for all mcp-seeded account-settings content rows · B42n test · PAS-005A §14 B42n row · pas-status-index Delivered
8. Evidence     — presentation-mcp-wrapper-b42n.test.ts · presentation-mcp-wrapper.registry.test.ts content aggregate · account-settings test suite unchanged · all gates pasted in Completion Report
9. Attestation  — Afenda-only content strangler · No bridge-index placeholder paths · Parity wrapperPath closure · Gate evidence
```

## B42n scope (~23 content slices)

| Public export | MCP block | Wrapper status | Governed source |
| --- | --- | --- | --- |
| `AppShellAccountSettings01ConnectAccount` | account-settings-01 | afenda-only | `blocks/account-settings-01/content/` |
| `AppShellAccountSettings01DangerZone` | account-settings-01 | afenda-only | same |
| `AppShellAccountSettings01EmailPassword` | account-settings-01 | afenda-only | same |
| `AppShellAccountSettings01PersonalInfo` | account-settings-01 | afenda-only | same |
| `AppShellAccountSettings01SocialUrl` | account-settings-01 | afenda-only | same |
| `AppShellAccountSettings02AllNotifications` | account-settings-02 | afenda-only | `blocks/account-settings-02/content/` |
| `AppShellAccountSettings02BrowserNotification` | account-settings-02 | afenda-only | same |
| `AppShellAccountSettings02DoNotDisturb` | account-settings-02 | afenda-only | same |
| `AppShellAccountSettings02InboxPreference` | account-settings-02 | afenda-only | same |
| `AppShellAccountSettings03DangerZone` | account-settings-03 | afenda-only | `blocks/account-settings-03/content/` |
| `AppShellAccountSettings03WorkspaceData` | account-settings-03 | afenda-only | same |
| `AppShellAccountSettings03WorkspaceDetail` | account-settings-03 | afenda-only | same |
| `AppShellAccountSettings03WorkspaceName` | account-settings-03 | afenda-only | same |
| `AppShellAccountSettings03WorkspaceOrganizations` | account-settings-03 | afenda-only | same |
| `AppShellAccountSettings04IntegrationSection` | account-settings-04 | afenda-only | `blocks/account-settings-04/content/` |
| `AppShellAccountSettings06Policy` | account-settings-06 | afenda-only | `blocks/app-shell-account-settings-06-policy.tsx` |
| `AppShellAccountSettings06User` | account-settings-06 | afenda-only | `blocks/app-shell-account-settings-06-user.tsx` |
| `AppShellAccountSettingsPanelSection` | account-settings-06 | afenda-only | `blocks/app-shell-account-settings-panel-section.tsx` |
| `AppShellAccountSettings07AddOns` | account-settings-07 | afenda-only | `blocks/account-settings-07/content/` |
| `AppShellAccountSettings07AiGateway` | account-settings-07 | afenda-only | same |
| `AppShellAccountSettings07AllBilling` | account-settings-07 | afenda-only | same |
| `AppShellAccountSettings07PaymentMethod` | account-settings-07 | afenda-only | same |
| `AppShellAccountSettings07SpendManagement` | account-settings-07 | afenda-only | same |

## DoD

- [x] Slice doc with 9-field handoff
- [x] 23 wrapper files under `presentation/wrappers/account-settings/content/`
- [x] `presentation-mcp-account-settings-content.registry.ts` with summary helper
- [x] `studio-block-parity.registry.ts` wrapperPath for all account-settings content mcp-seeded rows
- [x] AppShellAccountSettings01–07 shell exports and ERP slot props unchanged
- [x] `presentation-mcp-wrapper-b42n.test.ts` + registry test aggregate
- [x] All gates run with evidence
