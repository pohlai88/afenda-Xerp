import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  dirs: ["./src/providers"],
  maxDuration: 3600,
  project: process.env["TRIGGER_PROJECT_REF"] ?? "",
  runtime: "node",
});
