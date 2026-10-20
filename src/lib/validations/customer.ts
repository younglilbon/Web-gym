import { z } from "zod";
export const customerSchema = z.object({ full_name: z.string().trim().min(2).max(120), phone: z.string().trim().min(8).max(30), email: z.string().trim().email().optional().or(z.literal("")), health_notes: z.string().trim().max(4000), status: z.enum(["active", "inactive", "archived"]) });
export type CustomerInput = z.infer<typeof customerSchema>;
