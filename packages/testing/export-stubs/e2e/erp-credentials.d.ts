import type { Page } from "@playwright/test";

export interface E2EDevLoginCredentials {
  readonly email: string;
  readonly password: string;
}

export declare function hasE2EDevLoginCredentials(): boolean;
export declare function resolveE2EDevLoginCredentials(): E2EDevLoginCredentials;
export declare function hasE2EViewerLoginCredentials(): boolean;
export declare function resolveE2EViewerLoginCredentials(): E2EDevLoginCredentials;
export declare function signInWithEmailPassword(
  page: Page,
  credentials: E2EDevLoginCredentials
): Promise<void>;

export declare const E2E_DEV_FIXTURE_ANNOTATION: {
  readonly type: "fixture";
  readonly description: string;
};
