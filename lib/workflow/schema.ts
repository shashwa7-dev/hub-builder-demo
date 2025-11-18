import { z } from "zod";

export const CreateOrUpdateWorkflowSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  tools: z.array(z.number().int().positive()).min(1),
});

export type WorkflowPayload = z.infer<typeof CreateOrUpdateWorkflowSchema>;
