import { notFound } from "next/navigation";
import DashboardPageFrame from "@/components/dashboard/DashboardPageFrame";
import { CustomerDetail } from "@/components/customers/CustomerDetail";
import { isLocale, getDictionary } from "@/lib/i18n";
import { loadCustomerDetail } from "@/lib/customers/server";
export default async function CustomerDetailPage({ params }: { params: { locale: string; id: string } }) { if (!isLocale(params.locale)) notFound(); const detail = await loadCustomerDetail(params.id); return <DashboardPageFrame locale={params.locale} title={getDictionary(params.locale).dashboard.customers}><CustomerDetail locale={params.locale} detail={detail} /></DashboardPageFrame>; }
