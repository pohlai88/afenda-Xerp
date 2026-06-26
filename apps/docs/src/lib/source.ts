import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";
import { i18n } from "@/lib/i18n";
import { openapi } from "@/lib/openapi.server";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  i18n,
  plugins: [openapi.loaderPlugin()],
});
