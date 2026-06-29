"use client";

const CLIENT_ERROR_ENDPOINT = "/api/internal/v1/client-error" as const;

interface ReportClientErrorInput {
  readonly digest: string;
  readonly segment: string;
}

function isReportableDigest(digest: string | undefined): digest is string {
  if (digest === undefined) {
    return false;
  }

  const normalized = digest.trim();
  return normalized.length > 0 && normalized.length <= 128;
}

export function reportClientError(input: ReportClientErrorInput): void {
  if (!isReportableDigest(input.digest)) {
    return;
  }

  const payload = JSON.stringify({
    digest: input.digest.trim(),
    segment: input.segment,
  });

  void fetch(CLIENT_ERROR_ENDPOINT, {
    body: payload,
    headers: {
      "Content-Type": "application/json",
    },
    keepalive: true,
    method: "POST",
  }).catch(() => undefined);
}
