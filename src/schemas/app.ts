import { z } from "zod";

export const eventSchema = z.object({
  id: z.coerce.string().optional(),
  event: z
    .string()
    .min(2, { message: "Enter at least 2 characters" })
    .max(20, { message: "Event name must be no more than 20 characters" }),
  details: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
});

export const participantSchema = z.object({
  id: z.coerce.string().optional(),
  event: z.coerce.string(),
  participant_details: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
});

export const templateSchema = z.object({
  id: z.coerce.string().optional(),
  template_name: z.string().min(1, { message: "Template name is required" }),
  html_content: z.coerce.string(),
});

export const eventTemplateSchema = z.object({
  event_id: z.coerce.string(),
  template_id: z.coerce.string(),
  orientation: z.string()
})

export type EventForm = z.infer<typeof eventSchema> & { id?: string };
export type ParticipantForm = z.infer<typeof participantSchema> & {
  id?: string;
};
export type TemplateForm = z.infer<typeof templateSchema> & { id?: String };
