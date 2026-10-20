import { createClient } from "@/lib/supabase/server";
export async function loadNotifications() { const { data, error } = await createClient().from("notifications").select("id, title, body, action_url, read_at, created_at, notification_type").order("created_at", { ascending: false }).limit(50); return { data: data ?? [], error: error?.message ?? null }; }
