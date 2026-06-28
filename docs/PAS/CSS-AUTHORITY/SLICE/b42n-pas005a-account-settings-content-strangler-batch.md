# Slice B42n ÔÇö Account Settings Content Strangler Batch (PAS-005A ┬º14)

**Prerequisite:** B42m delivered ÔÇö marketing/auth/chart/statistics strangler wrappers; account-settings shell blocks (01ÔÇô07) remain afenda-only in main wrapper registry

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium ÔÇö wires ~23 account-settings content parity rows to afenda-only strangler wrappers; preserves ERP slot-prop shell compositions

**Clean Core impact:** AÔåÆA ÔÇö content wrappers delegate to existing governed blocks under `presentation/blocks/`; no MCP TSX copy; no auth-style ERP injection changes

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b42n-pas005a-account-settings-content-strangler-batch.md

1. Objective    ÔÇö Create afenda-only presentation MCP wrappers for all account-settings content parity rows (~23 slices across 01ÔÇô07 plus panel-section); add serializable content sub-registry; update studio-block-parity.registry wrapperPath columns; preserve AppShellAccountSettings01ÔÇô07 shell prop contracts and @afenda/appshell public exports.
2. Allowed layerÔÇö packages/appshell/src/presentation/wrappers/account-settings/** ┬À packages/appshell/src/presentation/wrappers/presentation-mcp-account-settings-content.registry.ts ┬À packages/appshell/src/__tests__/** ┬À packages/shadcn-studio/src/registry/studio-block-parity.registry.ts ┬À docs/PAS/CSS-AUTHORITY/SLICE/b42n-*.md ┬À docs/PAS/pas-status-index.md ┬À docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (┬º14 row)
3. Files        ÔÇö account-settings/content/**/*.wrapper.tsx (23) ┬À presentation-mcp-account-settings-content.registry.ts ┬À presentation-mcp-wrapper-b42n.test.ts ┬À presentation-mcp-wrapper.registry.test.ts (aggregate) ┬À studio-block-parity.registry.ts ┬À slice doc ┬À pas-status-index ┬À PAS-005A ┬º14
4. Prohibited   ÔÇö foundation-disposition.registry.ts ┬À replace account-settings with raw MCP blocks ┬À copy MCP TSX into appshell ┬À break AppShellAccountSettings01ÔÇô07 prop types or ERP tests ┬À change index.ts public exports unless thin re-export required
5. Authority    ÔÇö PAS-005A ┬À ADR-0017 ┬À Governed UI consumer rules ┬À B42i/B42m strangler registry ┬À account-settings governed blocks under presentation/blocks/
6. Gates        ÔÇö
   pnpm --filter @afenda/shadcn-studio build
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run -- account-settings
   pnpm --filter @afenda/appshell test:run
   pnpm quality:boundaries
   pnpm ui:guard:scan
7. Closes       ÔÇö 23 content strangler wrappers ┬À content sub-registry + summary helper ┬À parity wrapperPath for all mcp-seeded account-settings content rows ┬À B42n test ┬À PAS-005A ┬º14 B42n row ┬À pas-status-index Delivered
8. Evidence     ÔÇö presentation-mcp-wrapper-b42n.test.ts ┬À presentation-mcp-wrapper.registry.test.ts content aggregate ┬À account-settings test suite unchanged ┬À all gates pasted in Completion Report
9. Attestation  ÔÇö Afenda-only content strangler ┬À No bridge-index placeholder paths ┬À Parity wrapperPath closure ┬À Gate evidence
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
- [x] AppShellAccountSettings01ÔÇô07 shell exports and ERP slot props unchanged
- [x] `presentation-mcp-wrapper-b42n.test.ts` + registry test aggregate
- [x] All gates run with evidence
