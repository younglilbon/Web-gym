import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentRoles, getCurrentUser } from "@/lib/auth/server";
import { customerSchema } from "@/lib/validations/customer";
async function allowed() { const user = await getCurrentUser(); const roles = await getCurrentRoles(); return user && roles.some((role) => ["owner", "manager", "staff", "trainer"].includes(role)); }
export async function POST(request: Request) { if (!await allowed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const parsed = customerSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Invalid customer details" }, { status: 400 }); const { data, error } = await createClient().from("customers").insert(parsed.data).select("id").single(); if (error) return NextResponse.json({ error: "Could not create customer" }, { status: 409 }); return NextResponse.json({ id: data.id }, { status: 201 }); }
