# Bridging-R Implementation Index

Use this index to open the implementation detail document for each `Bridging-R`
backlog slice.

## Implementation detail documents

- [BR-0 - Preflight consistency](BR-0-PREFLIGHT-CONSISTENCY.md)
- [BR-0.1 - Synchronization and gap analysis](BR-0-1-SYNCHRONIZATION-AND-GAP-ANALYSIS.md)
- [BR-1 - Authority reconciliation](BR-1-AUTHORITY-RECONCILIATION.md)
- [BR-2 - Enterprise acceptance evidence backlog](BR-2-ENTERPRISE-ACCEPTANCE-EVIDENCE.md)
- [BR-3 - Ledger completion and first-cutover surface](BR-3-LEDGER-COMPLETION-AND-FIRST-CUTOVER-SURFACE.md)
- [BR-4 - CSS and export readiness](BR-4-CSS-AND-EXPORT-READINESS.md)
- [BR-5 - Real consumer selection](BR-5-REAL-CONSUMER-SELECTION.md)
- [BR-6 - Cutover validation backlog](BR-6-CUTOVER-VALIDATION-BACKLOG.md)
- [BR-7 - Release-owner governance](BR-7-RELEASE-OWNER-GOVERNANCE.md)

## Usage rule

- `BRIDGING-R-PHASE-R-READINESS.md` remains the parent gate.
- Execute the bridge in this order:
  - `BR-0`
  - `BR-0.1`
  - `BR-1` through `BR-7`
- The `BR-1` to `BR-7` documents are the child implementation guides.
- `BR-0` and `BR-0.1` are required preflight and synchronization authorities.
- Execute each child guide only within `packages/shadcn-studio-v2` documentation
  scope unless a later, separately authorized cutover phase amends that
  boundary.
- `PHASE-R-CONSUMER-CUTOVER-GUIDE.md` is not executable until the backlog in
  these child documents is cleared with concrete evidence.
