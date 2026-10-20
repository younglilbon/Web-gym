import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentRoles, getCurrentUser } from "@/lib/auth/server";
import { leadUpdateSchema } from "@/lib/validations/lead";

async function authorized() { const user = await getCurrentUser(); const roles = await getCurrentRoles(); return user && roles.some((role) => ["owner", "manager", "staff", "trainer"].includes(role)) ? user : null; }

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!await authorized()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = leadUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid lead details" }, { status: 400 });
  const { error } = await createClient().from("leads").update(parsed.data).eq("id", params.id);
  if (error) return NextResponse.json({ error: "Could not update lead" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
