"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/browser";
import { getDictionary, type Locale } from "@/lib/i18n";
import { hasSupabaseConfig } from "@/lib/env";

export default function LoginForm({ locale, errorCode }: { locale: Locale; errorCode?: string }) {
  const t = getDictionary(locale).auth;
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const initialError = errorCode === "not_authorized"
    ? t.notAuthorized
    : errorCode === "account_check_failed"
      ? t.accountCheckFailed
      : errorCode
        ? t.oauthError
        : "";
  const [error, setError] = useState(initialError);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  function dashboardPath() {
    return `/${locale}/dashboard`;
  }

  async function continueByEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!hasSupabaseConfig) {
      setError(t.missingConfig);
      return;
    }

    setPending(true);
    const supabase = createClient();
    if (mode === "signup") {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName.trim(), locale },
          emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`,
        },
      });
      setPending(false);
      if (authError) {
        setError(authError.message);
        return;
      }
      if (data.session) {
        window.location.assign(`/${locale}`);
        return;
      }
      setMessage(t.confirmEmail);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !data.user) {
      setError(t.invalidCredentials);
      setPending(false);
      return;
    }
    const { data: roleRows, error: rolesError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    setPending(false);
    if (rolesError) {
      setError(t.accountCheckFailed);
      return;
    }
    const isStaff = (roleRows ?? []).some((row) => ["owner", "trainer"].includes(row.role));
    window.location.assign(isStaff ? dashboardPath() : `/${locale}`);
  }

  async function signInWithProvider(provider: "google" | "facebook") {
    setError("");
    setMessage("");
    if (!hasSupabaseConfig) {
      setError(t.missingConfig);
      return;
    }
    setPending(true);
    const { error: authError } = await createClient().auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/${locale}/auth/callback` },
    });
    if (authError) {
      setError(t.oauthError);
      setPending(false);
    }
  }

  return (
    <main className="container narrow-page auth-page">
      <Link href={`/${locale}`} className="brand">Tuấn Đơn Giản</Link>
      <section className="card auth-card">
        <div>
          <div className="eyebrow">{mode === "login" ? t.eyebrow : t.signupEyebrow}</div>
          <h1>{mode === "login" ? t.title : t.signupTitle}</h1>
          <p>{mode === "login" ? t.loginDescription : t.signupDescription}</p>
        </div>
        <form onSubmit={continueByEmail} className="auth-form">
          {mode === "signup" && (
            <label>{t.fullName}
              <input autoComplete="name" required maxLength={120} value={fullName} onChange={(event) => setFullName(event.target.value)} />
            </label>
          )}
          <label>{t.email}
            <input autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>{t.password}
            <input autoComplete={mode === "login" ? "current-password" : "new-password"} type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
            {mode === "signup" && <small>{t.passwordHint}</small>}
          </label>
          {error && <small className="error" role="alert">{error}</small>}
          {message && <small className="auth-success" role="status">{message}</small>}
          <button disabled={pending} className="pill primary auth-submit">
            {pending ? t.signingIn : mode === "login" ? t.signIn : t.signUp}
          </button>
        </form>

        <div className="auth-divider"><span>{t.orContinueWith}</span></div>
        <div className="auth-social-grid">
          <button type="button" className="auth-social-button" disabled={pending} onClick={() => signInWithProvider("google")}>
            <span aria-hidden="true">G</span> Google
          </button>
          <button type="button" className="auth-social-button" disabled={pending} onClick={() => signInWithProvider("facebook")}>
            <span className="auth-facebook-mark" aria-hidden="true">f</span> Facebook
          </button>
        </div>
        <p className="auth-switch">
          {mode === "login" ? t.noAccount : t.haveAccount}
          <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}>
            {mode === "login" ? t.createAccount : t.signIn}
          </button>
        </p>
        <p className="auth-role-note">{t.customerAccountNotice}</p>
      </section>
    </main>
  );
}
