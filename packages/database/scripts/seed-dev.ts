import { seedDev } from "../src/seeds/seed-dev.js";
import { runSeedCommand } from "./run-seed.js";

const exitCode = await runSeedCommand({
  profile: "dev",
  execute: seedDev,
});

process.exit(exitCode);
