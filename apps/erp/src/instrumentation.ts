/**
 * Next.js server instrumentation hook — runs once at server startup (Node.js runtime only).
 *
 * Responsibilities:
 * - Wire the database-backed audit persistence adapter so all critical
 *   protected actions have a live audit path from the first request.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  // biome-ignore lint/complexity/useLiteralKeys: noPropertyAccessFromIndexSignature requires bracket notation
  if (process.env["NEXT_RUNTIME"] === "nodejs") {
    const { configureAuditEventPersistence } = await import(
      "@afenda/observability"
    );
    const { createDatabaseAuditAdapter } = await import("@afenda/database");

    configureAuditEventPersistence(createDatabaseAuditAdapter());
  }
}
