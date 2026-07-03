import { http, HttpResponse } from "msw";

/**
 * Global MSW handlers for the presentation lab.
 * Named buckets merge with story-level `parameters.msw.handlers` objects.
 *
 * @see https://github.com/mswjs/msw-storybook-addon#composing-request-handlers
 */
export const mswHandlers = {
  /** Platform liveness — mirrors apps/erp `/api/health` for future block fetches. */
  platform: [
    http.get("/api/health", () =>
      HttpResponse.json({ status: "ok" }, { status: 200 })
    ),
  ],
  /** Lab fixture profile — extend when blocks call internal v1 routes. */
  labProfile: [
    http.get("/api/internal/v1/lab/profile", () =>
      HttpResponse.json({
        displayName: "Ada Operator",
        email: "ada.operator@afenda.lab",
      })
    ),
  ],
  /** Auth shell preview — stub sign-in probe for agentic login stories. */
  authSession: [
    http.get("/api/auth/session", () =>
      HttpResponse.json({ authenticated: false }, { status: 200 })
    ),
    http.post("/api/auth/sign-in", async ({ request }) => {
      const body = (await request.json()) as { email?: string };
      return HttpResponse.json(
        {
          ok: true,
          email: body.email ?? "operator@afenda.lab",
        },
        { status: 200 }
      );
    }),
  ],
};
