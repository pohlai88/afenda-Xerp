import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const appSrcRoot = join(import.meta.dirname, "..");

const CONSOLE_PATTERN = /\bconsole\.(log|info|warn|error|debug)\s*\(/;

function collectSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(absolutePath));
      continue;
    }

    if (
      entry.isFile() &&
      (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))
    ) {
      files.push(absolutePath);
    }
  }

  return files;
}

describe("observability-usage — ERP source hygiene", () => {
  it("forbids console.* in apps/erp/src (use @afenda/observability)", () => {
    const violations: string[] = [];

    for (const filePath of collectSourceFiles(appSrcRoot)) {
      if (filePath.includes(`${join("src", "__tests__")}`)) {
        continue;
      }

      const source = readFileSync(filePath, "utf8");
      if (CONSOLE_PATTERN.test(source)) {
        violations.push(filePath.replace(`${appSrcRoot}\\`, "src/"));
      }
    }

    expect(violations).toEqual([]);
  });

  it("centralizes ERP logger creation in lib/observability/create-erp-logger.ts", () => {
    const source = readFileSync(
      join(appSrcRoot, "lib/observability/create-erp-logger.ts"),
      "utf8"
    );

    expect(source).toContain("createPinoLogger");
    expect(source).toContain("@afenda/observability");
  });

  it("routes API handler logging through api-handler-logging module", () => {
    const handlerSource = readFileSync(
      join(appSrcRoot, "server/api/runtime/create-api-handler.ts"),
      "utf8"
    );

    expect(handlerSource).toContain("./api-handler-logging");
    expect(handlerSource).not.toMatch(CONSOLE_PATTERN);
  });

  it("routes API audit evidence through recordErpAuditEvent", () => {
    const auditSource = readFileSync(
      join(appSrcRoot, "server/api/runtime/api-handler-audit.ts"),
      "utf8"
    );

    expect(auditSource).toContain("recordErpAuditEvent");
    expect(auditSource).not.toMatch(CONSOLE_PATTERN);
  });

  it("uses a single correlation header constant", () => {
    const headerSource = readFileSync(
      join(appSrcRoot, "lib/observability/correlation-header.ts"),
      "utf8"
    );
    const proxySource = readFileSync(join(appSrcRoot, "proxy.ts"), "utf8");

    expect(headerSource).toContain('"x-correlation-id"');
    expect(proxySource).toContain("correlation-header");
    expect(proxySource).not.toMatch(
      /function resolveCorrelationId\(request: NextRequest\)/
    );
  });

  it("does not retain legacy action-logger module", () => {
    expect(() =>
      statSync(join(appSrcRoot, "lib/observability/action-logger.ts"))
    ).toThrow();
  });

  it("keeps pino out of proxy.ts (edge runtime)", () => {
    const proxySource = readFileSync(join(appSrcRoot, "proxy.ts"), "utf8");

    expect(proxySource).not.toMatch(/from\s+["']pino["']/);
    expect(proxySource).not.toMatch(/createPinoLogger/);
    expect(proxySource).toContain("resolveCorrelationIdFromHeaders");
  });

  it("brands correlation IDs before ERP logger creation", () => {
    const loggerSource = readFileSync(
      join(appSrcRoot, "lib/observability/create-request-bound-logger.ts"),
      "utf8"
    );

    expect(loggerSource).toContain("toErpCorrelationId");
    expect(loggerSource).toContain("Promise<Logger>");
  });

  it("uses satisfies-backed ERP diagnostic defaults", () => {
    const defaultsSource = readFileSync(
      join(appSrcRoot, "lib/observability/erp-diagnostic-defaults.ts"),
      "utf8"
    );

    expect(defaultsSource).toContain("satisfies Pick<DiagnosticContext");
    expect(defaultsSource).toContain('service: "afenda-erp"');
  });

  it("wires audit persistence in server instrumentation bootstrap", () => {
    const instrumentationSource = readFileSync(
      join(appSrcRoot, "instrumentation.ts"),
      "utf8"
    );

    expect(instrumentationSource).toContain("configureAuditEventPersistence");
    expect(instrumentationSource).toContain("createDatabaseAuditAdapter");
    expect(instrumentationSource).toContain(
      'process.env["NEXT_RUNTIME"] === "nodejs"'
    );
  });
});
