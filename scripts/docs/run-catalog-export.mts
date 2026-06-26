import { exportProductCatalogs } from "./export-product-catalogs.mts";

const outputDirArg = process.argv.find((argument) =>
  argument.startsWith("--output-dir=")
);

if (outputDirArg) {
  process.env.AFENDA_DOCS_CATALOG_OUTPUT_DIR = outputDirArg.slice(
    "--output-dir=".length
  );
}

exportProductCatalogs().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
