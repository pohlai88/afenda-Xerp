import { z } from "zod";

export const blockFeedback = z.object({
  /** Full URL of page where feedback was submitted. */
  url: z.string(),
  blockId: z.string(),
  message: z.string(),
  /** Referenced text of the selected block. */
  blockBody: z.string(),
});

export const pageFeedback = z.object({
  opinion: z.enum(["good", "bad"]),
  /** Full URL of page where feedback was submitted. */
  url: z.string(),
  message: z.string(),
});

export const actionResponse = z.object({
  githubUrl: z.string().optional(),
});

export type BlockFeedback = z.infer<typeof blockFeedback>;
export type PageFeedback = z.infer<typeof pageFeedback>;
export type ActionResponse = z.infer<typeof actionResponse>;

export const pageFeedbackResult = pageFeedback.extend({
  response: actionResponse,
});

export const blockFeedbackResult = blockFeedback.extend({
  response: actionResponse,
});
