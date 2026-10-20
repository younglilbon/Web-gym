import { notFound } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { isLocale } from "@/lib/i18n";

export default function LocalizedLoginPage({ params, searchParams }: { params: { locale: string }; searchParams: { error?: string } }) { if (!isLocale(params.locale)) notFound(); return <LoginForm locale={params.locale} errorCode={searchParams.error} />; }
