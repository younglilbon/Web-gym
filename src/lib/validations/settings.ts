import { z } from "zod";
export const settingsSchema = z.object({ studio_name: z.string().trim().min(2).max(120), email: z.string().trim().email().or(z.literal("")), phone: z.string().trim().max(30), address: z.string().trim().max(300), default_locale: z.enum(["vi", "en"]), date_format: z.enum(["DD/MM/YYYY", "MM/DD/YYYY"]), timezone: z.string().min(1).max(80) });
