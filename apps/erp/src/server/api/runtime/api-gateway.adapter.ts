export interface ApiGatewayRequestContext {
  readonly contractId: string;
  readonly correlationId: string;
  readonly method: string;
  readonly path: string;
  readonly requestId: string;
}

export interface ApiGatewayResponseContext {
  readonly contractId: string;
  readonly correlationId: string;
  readonly requestId: string;
  readonly statusCode: number;
}

/** Future adapter seam for Kong or another API gateway — no runtime in this phase. */
export interface ApiGatewayAdapter {
  readonly name: "kong" | "none" | (string & {});
  postResponse?(input: ApiGatewayResponseContext): Promise<void>;
  preRequest?(input: ApiGatewayRequestContext): Promise<void>;
}

export const defaultApiGatewayAdapter: ApiGatewayAdapter = {
  name: "none",
};

export async function runApiGatewayPreRequest(
  adapter: ApiGatewayAdapter,
  input: ApiGatewayRequestContext
): Promise<void> {
  await adapter.preRequest?.(input);
}

export async function runApiGatewayPostResponse(
  adapter: ApiGatewayAdapter,
  input: ApiGatewayResponseContext
): Promise<void> {
  await adapter.postResponse?.(input);
}
