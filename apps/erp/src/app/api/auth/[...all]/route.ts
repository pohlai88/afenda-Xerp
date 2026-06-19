import { getAuth } from "@afenda/auth";
import { toNextJsHandler } from "better-auth/next-js";

type AuthRouteHandler = ReturnType<typeof toNextJsHandler>;

let handler: AuthRouteHandler | undefined;

function getHandler(): AuthRouteHandler {
  handler ??= toNextJsHandler(getAuth());
  return handler;
}

export function GET(request: Request) {
  return getHandler().GET(request);
}

export function POST(request: Request) {
  return getHandler().POST(request);
}
