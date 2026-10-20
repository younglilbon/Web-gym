import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { type Locale } from "@/lib/i18n";

export type AppRole = "owner" | "trainer" | "manager" | "staff" | "customer";

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  locale: string;
  is_active: boolean;
};

export async function getCurrentUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, locale, is_active")
    .eq("id", user.id)
    .maybeSingle<Profile>();
  return error ? null : data;
}

export async function getCurrentRoles(): Promise<AppRole[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);
  if (error) return [];
  return (data ?? []).map((row) => row.role as AppRole);
}

export async function requireStaff(locale: Locale) {
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const [profile, roles] = await Promise.all([getCurrentProfile(), getCurrentRoles()]);
  const allowed = roles.includes("owner") || roles.includes("trainer");
  if (!profile?.is_active || !allowed) redirect(`/${locale}/auth/login?error=not_authorized`);
  return { user, profile, roles };
}
