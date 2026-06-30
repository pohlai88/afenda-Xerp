import { z } from "zod";

const s2sSigningSecretSchema = z
  .string()
  .min(
    32,
    "AFENDA_INTERNAL_S2S_SIGNING_SECRET must be at least 32 characters."
  );

const s2sEnvSchema = z.object({
  AFENDA_INTERNAL_S2S_SIGNING_SECRET: s2sSigningSecretSchema,
});

export type S2sEnv = z.infer<typeof s2sEnvSchema>;

export function getS2sEnv(env: NodeJS.ProcessEnv = process.env): S2sEnv {
  return s2sEnvSchema.parse({
    AFENDA_INTERNAL_S2S_SIGNING_SECRET:
      env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"],
  });
}

export function getS2sSigningSecret(
  env: NodeJS.ProcessEnv = process.env
): string {
  return getS2sEnv(env).AFENDA_INTERNAL_S2S_SIGNING_SECRET;
}
