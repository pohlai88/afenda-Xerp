import { createNodeProject } from "../../../vitest.shared";

export default createNodeProject(import.meta.url, "@afenda/erp-modules", {
  pool: "forks",
  poolOptions: { forks: { singleFork: true } },
  testTimeout: 120_000,
  hookTimeout: 120_000,
});
