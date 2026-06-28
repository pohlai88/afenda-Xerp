#!/usr/bin/env node
/**
 * sessionStart — reset bundle preflight session state for automatic violation tracking.
 */
import { emit, log, resolveRepoRoot } from "./_hook-utils.mjs";
import { defaultSession, saveSession } from "./bundle-preflight-policy.mjs";

const TAG = "session-reset-preflight";

const repoRoot = resolveRepoRoot();
saveSession(repoRoot, defaultSession());
log(TAG, "bundle preflight session reset");

emit({});
