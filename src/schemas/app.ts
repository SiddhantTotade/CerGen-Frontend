import { z } from "zod";

export const eventSchema = z.object({
  event: z.string().min(2, { message: "Enter at least 2 characters" }),
  details: z.record(z.string()),
});

export type EventForm = z.infer<typeof eventSchema>