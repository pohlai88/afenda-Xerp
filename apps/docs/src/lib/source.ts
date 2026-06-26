import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/plugins/lucide-icons";
import { docsDraftTreeFilterPlugin } from "@/lib/docs-draft-tree-filter.plugin";
import { i18n } from "@/lib/i18n";
import { openapi } from "@/lib/openapi.server";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  i18n,
  plugins: [
    lucideIconsPlugin(),
    docsDraftTreeFilterPlugin(),
    openapi.loaderPlugin(),
  ],
});
