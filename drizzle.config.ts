/**
 * Monorepo-root Drizzle Kit entry — delegates to @afenda/database.
 *
 * Generate (from repo root):
 *   pnpm db:generate
 *
 * Apply pending migrations (from repo root):
 *   pnpm migrate
 */
export { default } from "./packages/database/drizzle.config.js";
