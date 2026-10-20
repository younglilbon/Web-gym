"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { formLabels } from "@/lib/i18n/form-labels";

type Values = { name: string; phone: string; email: string; goal: string; preferred_contact_method: "phone" | "email" | "sms" | "zalo" | "other"; consent: true; website: string };

export default function ConsultationForm({ locale }: { locale: Locale }) {
  const t = { ...getDictionary(locale).form, ...formLabels[locale] };
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>();
  async function submit(values: Values) {
    setSubmitError("");
    const response = await fetch("/api/public/consultations", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...values, locale }) });
    if (!response.ok) { setSubmitError(t.error); return; }
    setSent(true);
  }
  if (sent) return <div className="card" style={{ padding: 28, background: "#dff4e9", borderColor: "#c1e4cf" }}><div style={{ fontSize: 25 }}>✓</div><h2>{t.success}</h2><p style={{ color: "#637069" }}>{t.noPayment}</p></div>;
  return <form onSubmit={handleSubmit(submit)} className="card" style={{ padding: 28, display: "grid", gap: 15 }}><h2 style={{ margin: 0 }}>{t.title}</h2><label>{t.name}<input {...register("name", { required: t.required })} placeholder={t.name} />{errors.name && <small className="error">{errors.name.message}</small>}</label><label>{t.phone}<input {...register("phone", { required: t.required })} placeholder="090 123 4567" />{errors.phone && <small className="error">{errors.phone.message}</small>}</label><label>{t.email}<input type="email" {...register("email", { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t.invalidEmail } })} placeholder="you@example.com" />{errors.email && <small className="error">{errors.email.message}</small>}</label><label>{t.contactMethod}<select {...register("preferred_contact_method")}><option value="phone">{t.phone}</option><option value="email">{t.email}</option><option value="sms">SMS</option><option value="zalo">Zalo</option></select></label><label>{t.goal}<textarea {...register("goal")} rows={4} placeholder={t.goal} /></label><input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} {...register("website")} /><label style={{ display: "flex", gap: 8, alignItems: "flex-start" }}><input type="checkbox" {...register("consent", { required: t.consentRequired })} /> <span>{t.consent}<small style={{ display: "block", color: "#637069" }}>{t.privacy}</small></span></label>{errors.consent && <small className="error">{errors.consent.message}</small>}{submitError && <small className="error">{submitError}</small>}<button disabled={isSubmitting} className="pill" style={{ background: "#f28f6b", borderColor: "#f28f6b", padding: "13px 18px" }}>{isSubmitting ? "..." : t.submit}</button></form>;
}
