import { isExecutionJsonObject } from "../contracts/execution-metadata.contract.js";
import {
  createExecutionFailure,
  createExecutionSuccess,
  type ExecutionResult,
} from "../contracts/execution-result.contract.js";

const TRAILING_SLASH_PATTERN = /\/$/;

export interface TriggerDeploymentSnapshot {
  readonly checkedAt: string;
  readonly deploymentId: string;
  readonly deploymentVersion: string;
  readonly gitCommitSha: string | null;
  readonly status: string;
  readonly workerVersion: string | null;
}

export interface FetchLatestTriggerDeploymentOptions {
  readonly env?: NodeJS.ProcessEnv;
  readonly fetchImpl?: typeof fetch;
  readonly nowIso?: () => string;
}

function readTriggerApiUrl(env: NodeJS.ProcessEnv): string {
  return env["TRIGGER_API_URL"]?.trim() || "https://api.trigger.dev";
}

function readTriggerSecretKey(env: NodeJS.ProcessEnv): string | null {
  const secretKey = env["TRIGGER_SECRET_KEY"]?.trim();

  return secretKey ? secretKey : null;
}

function readGitCommitSha(git: unknown): string | null {
  if (!isExecutionJsonObject(git)) {
    return null;
  }

  const candidates = [git["commitSha"], git["commit"], git["sha"]];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
}

function readWorkerVersion(worker: unknown): string | null {
  if (!isExecutionJsonObject(worker)) {
    return null;
  }

  const version = worker["version"];

  return typeof version === "string" && version.trim() ? version.trim() : null;
}

function parseDeploymentRecord(
  record: unknown,
  checkedAt: string
): TriggerDeploymentSnapshot | null {
  if (!isExecutionJsonObject(record)) {
    return null;
  }

  const deploymentId = record["id"];
  const deploymentVersion = record["version"];
  const status = record["status"];

  if (
    typeof deploymentId !== "string" ||
    typeof deploymentVersion !== "string" ||
    typeof status !== "string"
  ) {
    return null;
  }

  return {
    checkedAt,
    deploymentId,
    deploymentVersion,
    gitCommitSha: readGitCommitSha(record["git"]),
    status,
    workerVersion: readWorkerVersion(record["worker"]),
  };
}

export async function fetchLatestTriggerDeployment(
  options: FetchLatestTriggerDeploymentOptions = {}
): Promise<ExecutionResult<TriggerDeploymentSnapshot>> {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? fetch;
  const checkedAt = options.nowIso?.() ?? new Date().toISOString();
  const secretKey = readTriggerSecretKey(env);

  if (!secretKey) {
    return createExecutionFailure(
      "provider_unavailable",
      "TRIGGER_SECRET_KEY is not configured."
    );
  }

  const apiUrl = readTriggerApiUrl(env).replace(TRAILING_SLASH_PATTERN, "");
  const requestUrl = `${apiUrl}/api/v1/deployments?status=DEPLOYED&page%5Bsize%5D=1`;

  try {
    const response = await fetchImpl(requestUrl, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
      method: "GET",
    });

    if (!response.ok) {
      return createExecutionFailure(
        "provider_error",
        `Trigger.dev deployments API returned HTTP ${response.status}.`
      );
    }

    const payload: unknown = await response.json();

    if (!isExecutionJsonObject(payload)) {
      return createExecutionFailure(
        "provider_error",
        "Trigger.dev deployments API returned an invalid payload."
      );
    }

    const records = payload["data"];

    if (!Array.isArray(records) || records.length === 0) {
      return createExecutionFailure(
        "provider_error",
        "No deployed Trigger.dev worker was found for release alignment."
      );
    }

    const snapshot = parseDeploymentRecord(records[0], checkedAt);

    if (!snapshot) {
      return createExecutionFailure(
        "provider_error",
        "Trigger.dev deployment record could not be parsed."
      );
    }

    return createExecutionSuccess(snapshot);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Trigger.dev deployments API request failed.";

    return createExecutionFailure("provider_error", message);
  }
}
