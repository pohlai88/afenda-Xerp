import { syncEnvVars } from "@trigger.dev/build/extensions/core";
import { defineConfig } from "@trigger.dev/sdk";

const S2S_PROBE_ENV_KEYS = [
  "AFENDA_INTERNAL_S2S_SIGNING_SECRET",
  "BETTER_AUTH_URL",
] as const;

export default defineConfig({
  dirs: ["./src/trigger"],
  maxDuration: 3600,
  project: process.env["TRIGGER_PROJECT_REF"] ?? "",
  runtime: "node",
  build: {
    extensions: [
      syncEnvVars(async () =>
        S2S_PROBE_ENV_KEYS.flatMap((name) => {
          const value = process.env[name]?.trim();
          return value === undefined || value.length === 0
            ? []
            : [{ name, value }];
        })
      ),
    ],
  },
});
