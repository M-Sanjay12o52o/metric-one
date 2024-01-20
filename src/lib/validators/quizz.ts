import { z } from "zod";

export const QuizzValidator = z.object({
  name: z.string().min(3).max(21),
});

export const QuizzSubscriptionValidator = z.object({
  quizzId: z.string(),
});

export type CreateQuizzPayload = z.infer<typeof QuizzValidator>;

export type SubscribeToQuizzPayload = z.infer<typeof QuizzValidator>;
