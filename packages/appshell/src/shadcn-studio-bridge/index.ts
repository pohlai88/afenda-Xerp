/**
 * PAS-005A B42d — appshell re-export bridge for live @afenda/shadcn-studio MCP blocks.
 *
 * Legacy governed blocks remain under ../shadcn-studio/ until parity registry reports deleteBlocked: false.
 * Do not copy legacy TSX — extend via MCP /cui batches only.
 */

export {
  computeStudioBlockParitySummary,
  HeroSection01Block as AppShellPresentationHeroSection01,
  LEGACY_APPSHELL_STUDIO_BLOCK_COUNT,
  LoginPage04Block as AppShellPresentationLoginPage04,
  SHADCN_STUDIO_BLOCK_PARITY_REGISTRY,
  StatisticsCard01Block as AppShellPresentationStatisticsCard01,
  type StudioBlockParityEntry,
  type StudioBlockParityStatus,
  type StudioBlockParitySummary,
} from "@afenda/shadcn-studio";
