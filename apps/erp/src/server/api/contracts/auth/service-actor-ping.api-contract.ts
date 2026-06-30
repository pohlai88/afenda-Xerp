import { z } from "zod";

export const serviceActorPingResponseSchema = z
  .object({
    status: z.literal("ok").meta({
      description: "Service-actor S2S verification probe status.",
      example: "ok",
    }),
  })
  .meta({
    id: "ServiceActorPingResponse",
    description:
      "Ping response confirming verified service-actor bearer token acceptance.",
  });

export type ServiceActorPingResponseDto = z.infer<
  typeof serviceActorPingResponseSchema
>;
