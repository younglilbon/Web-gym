import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const locale = request.nextUrl.pathname.match(/^\/(vi|en)(?:\/|$)/)?.[1] ?? "vi";
  requestHeaders.set("x-fitmanager-locale", locale);
  let response = NextResponse.next({ request: { headers: requestHeaders } });
  const supabaseUrl = env.supabaseUrl;
  const supabaseAnonKey = env.supabaseAnonKey;
  if (!supabaseUrl || !supabaseAnonKey) {
    if (request.nextUrl.pathname.startsWith("/dashboard") || /^\/(vi|en)\/dashboard/.test(request.nextUrl.pathname)) { const locale = request.nextUrl.pathname.match(/^\/(vi|en)/)?.[1] ?? "vi"; return NextResponse.redirect(new URL(`/${locale}/auth/login?error=missing_supabase_config`, request.url)); }
    return response;
  }
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, { cookies: { getAll: () => request.cookies.getAll(), setAll: (items: { name: string; value: string; options?: Parameters<typeof response.cookies.set>[2] }[]) => items.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) } });
  const { data: { user } } = await supabase.auth.getUser();
  if ((request.nextUrl.pathname.startsWith("/dashboard") || /^\/(vi|en)\/dashboard/.test(request.nextUrl.pathname)) && !user) { const locale = request.nextUrl.pathname.match(/^\/(vi|en)/)?.[1] ?? "vi"; return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url)); }
  return response;
}

export const config = { matcher: ["/", "/vi/:path*", "/en/:path*", "/dashboard/:path*"] };
