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
};
