import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentRoles, getCurrentUser } from "@/lib/auth/server";
import { customerSchema } from "@/lib/validations/customer";
export async function PATCH(request: Request, { params }: { params: { id: string } }) { const user = await getCurrentUser(); const roles = await getCurrentRoles(); if (!user || !roles.some((role) => ["owner", "manager", "staff", "trainer"].includes(role))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const parsed = customerSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Invalid customer details" }, { status: 400 }); const { error } = await createClient().from("customers").update(parsed.data).eq("id", params.id); if (error) return NextResponse.json({ error: "Could not update customer" }, { status: 409 }); return NextResponse.json({ ok: true }); }
