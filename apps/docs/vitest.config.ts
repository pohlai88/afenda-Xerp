import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { mergeConfig } from "vitest/config";
import { createReactProject } from "../../vitest.shared";

const root = dirname(fileURLToPath(import.meta.url));

function stubCssPlugin(): Plugin {
  return {
    name: "stub-css",
    transform(_code, id) {
      if (id.endsWith(".css")) {
        return { code: "export default {}", map: null };
      }
    },
  };
}

const base = createReactProject(import.meta.url, "@afenda/docs", {
  alias: {
    "@": resolve(root, "src"),
    "collections/server": resolve(root, ".source/server.ts"),
    "fumadocs-ui/dist/components/image-zoom2.css": resolve(
      root,
      "src/__tests__/setup/empty-module.ts"
    ),
  },
});

export default mergeConfig(base, {
  plugins: [stubCssPlugin()],
});
