import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentRoles, getCurrentUser } from "@/lib/auth/server";
import { leadConversionSchema } from "@/lib/validations/lead";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(); const roles = await getCurrentRoles();
  if (!user || !roles.some((role) => ["owner", "manager", "staff", "trainer"].includes(role))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = leadConversionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Customer details are required" }, { status: 400 });
  const { data, error } = await createClient().rpc("convert_lead_to_customer", { p_lead_id: params.id, p_full_name: parsed.data.full_name, p_phone: parsed.data.phone, p_email: parsed.data.email || null });
  if (error) return NextResponse.json({ error: "Could not convert lead" }, { status: 409 });
  return NextResponse.json({ customerId: data });
}
