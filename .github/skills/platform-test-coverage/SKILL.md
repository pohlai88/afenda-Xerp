---
name: platform-test-coverage
description: Enforces Vitest test coverage gates, test pyramid discipline, mocking patterns, and co-location rules across all @afenda packages. Use when writing tests, reviewing test files, setting up a new package, checking coverage, or when the user mentions testing, coverage, mocks, or vitest.
disable-model-invocation: true
paths:
  - **/*.{test,spec}.{ts,tsx}
  - packages/testing/**
---

# platform-test-coverage

Tests are the safety net for refactoring. Without enforced coverage gates, the net has holes.

## Coverage gates (non-negotiable)

```
functions : ≥ 90%
branches  : ≥ 80%
lines     : ≥ 85%
statements: ≥ 85%
```

Add these to every `vitest.config.ts` under `test.coverage.thresholds`. See [THRESHOLDS.md](THRESHOLDS.md) for copy-paste blocks by package type.

---

## Non-negotiable rules

1. **No `.only` or `.skip` committed.** Biome lint and CI both reject them. Fix or delete the test.
2. **No `done` callback in async tests.** Use `async/await` — done callbacks hide race conditions.
3. **No `setTimeout` in test body.** Use `vi.useFakeTimers()` + `vi.advanceTimersByTime()` for time-dependent logic.
4. **`mockRestore` in `afterEach` for every `vi.spyOn`.** Leaked spies corrupt later tests silently.
5. **`vi.fn()` for injected dependencies; `vi.spyOn` for real module side-effects.** Never spy on a dependency you could inject.
6. **Test co-location.** Tests live in `__tests__/` next to the file under test — not in a root-level `tests/` folder.
7. **One logical assertion per test.** Multiple `expect` calls are fine when they test the same logical outcome.

---

## Test pyramid

```
Unit (80%)          → pure functions, contracts, validators, transformers
  └── packages/*/src/__tests__/

Integration (20%)   → service functions with real (test) DB or mocked IO
  └── packages/*/src/__tests__/ (using @afenda/testing mocks)

E2E (Playwright)    → user flows in apps/erp — NOT in vitest
  └── apps/erp/e2e/
```

Vitest is for unit and integration only. Never write full browser E2E in vitest.

### Interactive component tests (Radix / appshell)

- **Setup:** `packages/testing/src/setup/react.ts` + `@afenda/testing/react`
- **API:** `setupUser()` (not `fireEvent`), helpers `openMenu`, `openDialog`, `openListbox`, …
- **File naming:** `*.interaction.test.tsx` for click-to-open / keyboard flows; governance render tests stay in `*.test.tsx`
- **Run:** `pnpm test:interaction` (monorepo — `@afenda/testing`, `@afenda/developer`, `@afenda/erp`) or `pnpm --filter @afenda/<app> test:interaction`
- **Timeout:** `INTERACTION_TEST_TIMEOUT_MS` from `@afenda/testing/react`; set per suite with `vi.setConfig({ testTimeout })` when needed

---

## Mocking discipline

### vi.fn() — for injected dependencies

```ts
// ✅ Inject the mock — no spyOn needed
const mockLogger = { info: vi.fn(), error: vi.fn(), warn: vi.fn() };
const service = new UserService({ logger: mockLogger, db: mockDb });

it("logs on successful creation", async () => {
  await service.createUser({ email: "a@b.com" });
  expect(mockLogger.info).toHaveBeenCalledWith(
    expect.objectContaining({ msg: "user.created" })
  );
});
```

### vi.spyOn() — for real module side-effects with afterEach restore

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import * as observability from "@afenda/observability";

describe("createPost", () => {
  afterEach(() => {
    vi.restoreAllMocks();  // restores all spyOn mocks created in this suite
  });

  it("writes audit event on success", async () => {
    const spy = vi.spyOn(observability, "writeAuditEvent").mockResolvedValue(undefined);
    await createPost({ title: "Hello", content: "World" });
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ action: "post.create", outcome: "success" })
    );
  });
});
```

### Forbidden mock patterns

```ts
// ❌ Module-level mock state — persists across test files
vi.mock("@afenda/observability", () => ({ writeAuditEvent: vi.fn() }));

// ❌ No restore — spy leaks into the next test
it("test A", () => {
  vi.spyOn(console, "error");
  // no mockRestore in afterEach
});

// ❌ Real timer in test — flaky and slow
it("expires after 5 seconds", async () => {
  await new Promise(r => setTimeout(r, 5000));  // 5 real seconds
});

// ✅ Fake timer — deterministic
it("expires after 5 seconds", async () => {
  vi.useFakeTimers();
  const p = waitForExpiry();
  vi.advanceTimersByTime(5_001);
  await expect(p).resolves.toBe("expired");
  vi.useRealTimers();
});
```

---

## Test co-location

```
packages/observability/src/
  create-pino-logger.ts
  __tests__/
    pino.test.ts        ← tests for create-pino-logger.ts
    correlation.test.ts ← tests for correlation.contract.ts
```

Never create:
```
packages/observability/tests/   ← wrong — not co-located
test/                           ← wrong — root-level
spec/                           ← wrong — non-standard
```

---

## Test file anatomy

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { functionUnderTest } from "../function-under-test.js";

describe("functionUnderTest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("happy path", () => {
    it("returns the expected value for valid input", () => {
      const result = functionUnderTest({ input: "valid" });
      expect(result.ok).toBe(true);
      expect(result.value).toBe("expected");
    });
  });

  describe("error cases", () => {
    it("returns error for invalid input", () => {
      const result = functionUnderTest({ input: "" });
      expect(result.ok).toBe(false);
      expect(result.error.code).toBe("VALIDATION_ERROR");
    });
  });
});
```

---

## Verification

```bash
# Run tests with coverage for a single package
pnpm --filter @afenda/observability test:run -- --coverage

# Run all tests
pnpm test:run

# Check coverage report
open packages/observability/coverage/index.html
```

See [THRESHOLDS.md](THRESHOLDS.md) for ready-to-paste `vitest.config.ts` coverage threshold blocks.
