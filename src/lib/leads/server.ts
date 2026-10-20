import { createClient } from "@/lib/supabase/server";

export type LeadRecord = {
  id: string; full_name: string; phone: string; email: string | null; goals: string | null;
  preferred_contact_method: string; source: string; status: string; notes: string | null;
  created_at: string; last_contacted_at: string | null; follow_up_at: string | null;
};

export async function loadLeads(): Promise<{ data: LeadRecord[]; error: string | null }> {
  const { data, error } = await createClient().from("leads").select("id, full_name, phone, email, goals, preferred_contact_method, source, status, notes, created_at, last_contacted_at, follow_up_at").order("created_at", { ascending: false });
  return { data: (data ?? []) as LeadRecord[], error: error?.message ?? null };
}
