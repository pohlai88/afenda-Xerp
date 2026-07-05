# shadcn-studio-v2 quarantine

This folder is the V2 landing zone for raw vendor or experimental UI copied during
future slices.

Rules:

- Do not export quarantine files from root, client, server, or metadata entrypoints.
- Promote only after taxonomy placement, accessibility review, token review, and
  V2-local tests.
- Keep raw imports out of ERP apps and legacy studio packages.
- Delete abandoned quarantine files before slice handoff.
