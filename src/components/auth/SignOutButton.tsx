"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { getDictionary, type Locale } from "@/lib/i18n";

export function SignOutButton({ locale }: { locale: Locale }) {
  const router = useRouter();
  const label = getDictionary(locale).auth.signOut;
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    const { error } = await createClient().auth.signOut();
    if (!error) router.replace(`/${locale}/auth/login?signed_out=1`);
    else setPending(false);
  }

  return (
    <button type="button" onClick={signOut} disabled={pending} className="text-left text-xs text-ink/60 hover:text-ink disabled:opacity-50">
      {pending ? "…" : label}
    </button>
  );
}
