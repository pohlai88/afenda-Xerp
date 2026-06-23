export interface WorkerReleaseAlignmentInput {
  readonly appReleaseSha: string | null;
  readonly triggerGitCommitSha: string | null;
  readonly workerReleaseCheckRequired: boolean;
}

export interface WorkerReleaseAlignmentResult {
  readonly aligned: boolean;
  readonly errorMessage: string | null;
  readonly skipped: boolean;
}

function normalizeReleaseSha(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  return normalized.length > 0 ? normalized : null;
}

export function evaluateWorkerReleaseAlignment(
  input: WorkerReleaseAlignmentInput
): WorkerReleaseAlignmentResult {
  if (!input.workerReleaseCheckRequired) {
    return {
      aligned: true,
      errorMessage: null,
      skipped: true,
    };
  }

  const appReleaseSha = normalizeReleaseSha(input.appReleaseSha);
  const triggerGitCommitSha = normalizeReleaseSha(input.triggerGitCommitSha);

  if (!appReleaseSha) {
    return {
      aligned: false,
      errorMessage:
        "Worker release check is required but no app release SHA is configured. Set VERCEL_GIT_COMMIT_SHA or AFENDA_RELEASE_SHA.",
      skipped: false,
    };
  }

  if (!triggerGitCommitSha) {
    return {
      aligned: false,
      errorMessage:
        "Trigger.dev latest deployment does not include a git commit SHA for release alignment.",
      skipped: false,
    };
  }

  if (appReleaseSha !== triggerGitCommitSha) {
    return {
      aligned: false,
      errorMessage: `Trigger worker release mismatch: app=${appReleaseSha} trigger=${triggerGitCommitSha}`,
      skipped: false,
    };
  }

  return {
    aligned: true,
    errorMessage: null,
    skipped: false,
  };
}
