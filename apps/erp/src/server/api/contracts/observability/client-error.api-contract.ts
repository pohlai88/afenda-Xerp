import { z } from "zod";

const clientErrorSlugSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[\w.-]+$/u);

const clientErrorDigestSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[\w.-]+$/u);

export const clientErrorPostRequestSchema = z.object({
  digest: clientErrorDigestSchema,
  segment: clientErrorSlugSchema,
});

export type ClientErrorPostRequestDto = z.infer<
  typeof clientErrorPostRequestSchema
>;

export const clientErrorPostResponseSchema = z.object({
  accepted: z.literal(true),
});

export type ClientErrorPostResponseDto = z.infer<
  typeof clientErrorPostResponseSchema
>;
