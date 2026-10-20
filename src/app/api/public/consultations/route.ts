import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { consultationSchema } from "@/lib/validations/consultation"; import { hasSupabaseConfig } from "@/lib/env";

export async function POST(request: Request) {
  const parsed = consultationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid consultation details" }, { status: 400 });
  if (!hasSupabaseConfig) return NextResponse.json({ error: "Supabase is not configured. Add values to .env.local." }, { status: 503 });
  const supabase = createClient();
  const { data, error } = await supabase.rpc("submit_consultation", { payload: { full_name: parsed.data.name, phone: parsed.data.phone, email: parsed.data.email || null, goals: parsed.data.goal, preferred_locale: parsed.data.locale, preferred_contact_method: parsed.data.preferred_contact_method, consent: parsed.data.consent, website: parsed.data.website } });
  if (error) return NextResponse.json({ error: "Could not save consultation request" }, { status: 500 });
  return NextResponse.json({ id: data }, { status: 201 });
}
