import { z } from "zod";
export const scheduleSchema = z.object({ customer_id: z.string().uuid(), trainer_id: z.string().uuid(), membership_id: z.string().uuid().optional().or(z.literal("")), starts_at: z.string().datetime(), duration_minutes: z.coerce.number().int().positive().max(480), location: z.string().trim().max(300), internal_notes: z.string().trim().max(4000) });
export const completionSchema = z.object({ summary: z.string().trim().min(1).max(4000), internal_notes: z.string().trim().max(4000), attendance_status: z.enum(["attended", "no_show"]) });
