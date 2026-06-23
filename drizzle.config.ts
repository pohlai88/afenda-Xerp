/**
 * Monorepo-root Drizzle Kit entry — delegates to @afenda/database.
 *
 * Generate (from repo root):
 *   pnpm db:generate
 *
 * Apply pending migrations (from repo root):
 *   pnpm migrate
 */
// biome-ignore lint/performance/noBarrelFile: monorepo drizzle entry delegates to @afenda/database
export { default } from "./packages/database/drizzle.config.js";
