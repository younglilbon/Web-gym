import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest, { params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    return NextResponse.redirect(new URL("/vi/auth/login?error=oauth_failed", request.url));
  }

  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL(`/${params.locale}/auth/login?error=oauth_failed`, request.url));
  }

  const supabase = createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return NextResponse.redirect(new URL(`/${params.locale}/auth/login?error=oauth_failed`, request.url));
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.redirect(new URL(`/${params.locale}/auth/login?error=oauth_failed`, request.url));
  }

  const { data: roleRows, error: rolesError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);
  if (rolesError) {
    return NextResponse.redirect(new URL(`/${params.locale}/auth/login?error=account_check_failed`, request.url));
  }

  const isStaff = (roleRows ?? []).some((row) => ["owner", "trainer"].includes(row.role));
  return NextResponse.redirect(new URL(isStaff ? `/${params.locale}/dashboard` : `/${params.locale}`, request.url));
}
