// biome-ignore lint/correctness/noUndeclaredDependencies: Fumadocs MDX generates the virtual `collections/*` module at build time.
import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
