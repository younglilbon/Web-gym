import { z } from "zod";

export const leadStatusSchema = z.enum(["new", "contacted", "qualified", "converted", "lost"]);
export const contactMethodSchema = z.enum(["phone", "email", "sms", "zalo", "other"]);
export const leadUpdateSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(30),
  email: z.string().trim().email().optional().or(z.literal("")),
  goals: z.string().trim().max(2000),
  preferred_contact_method: contactMethodSchema,
  status: leadStatusSchema,
  notes: z.string().trim().max(4000),
  last_contacted_at: z.string().datetime().optional().nullable(),
  follow_up_at: z.string().datetime().optional().nullable(),
});
export const leadCreateSchema = leadUpdateSchema.omit({ status: true }).extend({ status: leadStatusSchema.default("new"), source: z.enum(["manual", "website", "referral", "other"]).default("manual") });
export const leadConversionSchema = z.object({ full_name: z.string().trim().min(2).max(120), phone: z.string().trim().min(8).max(30), email: z.string().trim().email().optional().or(z.literal("")) });
