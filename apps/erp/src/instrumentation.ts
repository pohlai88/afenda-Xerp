export async function register() {
  if (process.env["NEXT_RUNTIME"] === "nodejs") {
    const { configureAuditEventPersistence } = await import(
      "@afenda/observability"
    );
    const { createDatabaseAuditAdapter } = await import("@afenda/database");

    configureAuditEventPersistence(createDatabaseAuditAdapter());
  }
}
