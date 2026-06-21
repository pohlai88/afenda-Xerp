import { createReactProject } from "../../vitest.shared";

export default createReactProject(import.meta.url, "@afenda/metadata-ui", {
  setupFiles: ["src/__tests__/setup/vitest.setup.ts"],
});
