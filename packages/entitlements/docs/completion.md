# Foundation phase 08 — Feature Flags and Entitlements

## Production integration

### Database-backed provisioning

Commercial access is persisted in `@afenda/database`:

- `entitlement_grants` — tenant-scoped entitlement keys
- `usage_limit_counters` — tenant usage limits
- `tenant_commercial_plans` — active plan template audit trail
- `platform_feature_flags` — rollout registry
- `platform_kill_switches` — kill switch registry

Provision at plan activation (billing boundary only):

```typescript
import { provisionTenantEntitlements } from "@afenda/database";

await provisionTenantEntitlements({
  tenantId,
  planTemplateId: "pro",
  correlationId,
  audit: { actorType: "system", correlationId, source: "system" },
});
```

Sync platform rollout catalog (bootstrap / deploy):

```typescript
import { syncPlatformRolloutCatalog, loadPlatformRolloutBundle } from "@afenda/database";

await syncPlatformRolloutCatalog();
const rollout = await loadPlatformRolloutBundle();
```

`seedPlatform` also calls `syncPlatformRolloutCatalog` automatically during platform baseline seeding.

Load for evaluation:

```typescript
import {
  loadTenantEntitlementBundle,
  loadPlatformRolloutBundle,
} from "@afenda/database";
import {
  mapDatabaseBundleToEvaluationData,
  mapPlatformRolloutToEvaluationData,
  evaluateCapability,
} from "@afenda/entitlements";

const [tenantBundle, rolloutBundle] = await Promise.all([
  loadTenantEntitlementBundle(tenantId),
  loadPlatformRolloutBundle(),
]);

const { entitlements, usageLimits } = mapDatabaseBundleToEvaluationData(tenantBundle);
const { featureFlags, killSwitches } = mapPlatformRolloutToEvaluationData(rolloutBundle);
```

Product code must call `evaluateCapability` / `entitlement()` — never compare plan names.

### Evaluation cache (Upstash Redis)

`EvaluationCache` is async and backed by Upstash when env is configured:

- `UPSTASH_REDIS_REST_URL` (`.env.config`)
- `UPSTASH_REDIS_REST_TOKEN` (`.env.secret`)

```typescript
import {
  createEvaluationCacheFromEnv,
  createCachedCapabilityEvaluator,
  evaluateCapability,
} from "@afenda/entitlements";

const cache = createEvaluationCacheFromEnv();
const evaluateCached = createCachedCapabilityEvaluator(evaluateCapability, { cache });

const decision = await evaluateCached(input);

// After provisioning or plan change:
await cache.invalidateTenant(tenantId);
```

Falls back to in-memory TTL cache when Upstash env vars are absent (local dev).

### Feature flag fail-open policy

`resolveFeatureFlag` **fails open** when a flag key is absent (`enabled: true`). This supports gradual rollout.

| API | Missing flag behavior | Use when |
|-----|----------------------|----------|
| `resolveFeatureFlag` / `isEnabled` | Allow | Gradual rollout, new features |
| `resolveFeatureFlagStrict` / `isEnabledStrict` | Deny | SSO, admin, security-sensitive paths |

Constant: `FEATURE_FLAG_FAIL_OPEN_DEFAULT = true`

Entitlement checks remain the commercial access gate; feature flags control deployment rollout only.

## Live verification

Postgres round-trip (requires migrated DB):

```bash
pnpm migrate
AFENDA_LIVE_DB_TEST=yes pnpm --filter @afenda/database test src/__tests__/entitlement-provision.live.test.ts
```

Upstash Redis round-trip (requires token in `.env.secret`):

```bash
AFENDA_LIVE_REDIS_TEST=yes pnpm --filter @afenda/entitlements test src/__tests__/upstash-evaluation-cache.live.test.ts
```

## Rollback

1. Re-provision prior plan template via `provisionTenantEntitlements`
2. Call `await cache.invalidateTenant(tenantId)`
3. Arm kill switch via `platform_kill_switches` update if immediate deny required

## Verification

```bash
pnpm --filter @afenda/database test
pnpm --filter @afenda/entitlements test
pnpm --filter @afenda/feature-flags test
```
