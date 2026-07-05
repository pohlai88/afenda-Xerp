import { createNodeProject } from "../../vitest.shared";

export default createNodeProject(import.meta.url, "@afenda/shadcn-studio-v2", {
  testInclude: ["src/**/__tests__/**/*.{test,spec}.{ts,tsx}"],
});
