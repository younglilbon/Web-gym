import { z } from "zod";

export const consultationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(30),
  email: z.string().trim().email().optional().or(z.literal("")),
  goal: z.string().trim().max(2000).optional().default(""),
  locale: z.enum(["vi", "en"]).default("vi"),
  preferred_contact_method: z.enum(["phone", "email", "sms", "zalo", "other"]).default("phone"),
  consent: z.literal(true),
  website: z.string().max(0).optional().default("")
});

export type ConsultationInput = z.infer<typeof consultationSchema>;
