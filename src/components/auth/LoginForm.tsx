"use client";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { getDictionary, type Locale } from "@/lib/i18n";
import { hasSupabaseConfig } from "@/lib/env";

export default function LoginForm({ locale, errorCode }: { locale: Locale; errorCode?: string }) {
  const t = getDictionary(locale).auth;
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(errorCode === "not_authorized" ? t.notAuthorized : "");
  const [pending, setPending] = useState(false);
  async function login(event: React.FormEvent) {
    event.preventDefault(); setError("");
    if (!hasSupabaseConfig) { setError(t.missingConfig); return; }
    setPending(true);
    const { error: authError } = await createClient().auth.signInWithPassword({ email, password });
    if (authError) { setError(t.invalidCredentials); setPending(false); return; }
    window.location.assign(`/${locale}/dashboard`);
  }
  return <main className="container narrow-page"><Link href={`/${locale}`} className="brand">Tuấn Đơn Giản</Link><form onSubmit={login} className="card" style={{ padding: 28, display: "grid", gap: 15 }}><div><div className="eyebrow">{t.eyebrow}</div><h1 style={{ fontSize: 42, margin: "12px 0" }}>{t.title}</h1></div><label>{t.email}<input autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>{t.password}<input autoComplete="current-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <small className="error" role="alert">{error}</small>}<button disabled={pending} className="pill primary" style={{ padding: 13 }}>{pending ? t.signingIn : t.signIn}</button></form></main>;
}
