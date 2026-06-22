import { z } from "zod";

const serverRuntimeEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
});

export type ServerRuntimeEnv = z.infer<typeof serverRuntimeEnvSchema>;

export function getServerRuntimeEnv(
  env: NodeJS.ProcessEnv = process.env
): ServerRuntimeEnv {
  return serverRuntimeEnvSchema.parse({
    NODE_ENV: env["NODE_ENV"] ?? "development",
  });
}

export function isProductionRuntime(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return getServerRuntimeEnv(env).NODE_ENV === "production";
}
