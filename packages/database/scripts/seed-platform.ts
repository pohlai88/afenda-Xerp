import { seedPlatform } from "../src/seeds/seed-platform.js";
import { runSeedCommand } from "./run-seed.js";

const exitCode = await runSeedCommand({
  profile: "platform",
  execute: seedPlatform,
});

process.exit(exitCode);
