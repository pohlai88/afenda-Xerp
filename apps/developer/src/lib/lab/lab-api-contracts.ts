export interface LabHealthResponse {
  doctrine: string;
  service: "developer-route-lab";
  status: "ok";
}

export const labHealthResponseSchema = {
  doctrine: "frontend-shape-only",
  service: "developer-route-lab",
  status: "ok",
} as const satisfies LabHealthResponse;
