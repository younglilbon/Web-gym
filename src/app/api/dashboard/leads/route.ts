import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentRoles, getCurrentUser } from "@/lib/auth/server";
import { leadCreateSchema } from "@/lib/validations/lead";

async function authorized() { const user = await getCurrentUser(); const roles = await getCurrentRoles(); return user && roles.some((role) => ["owner", "manager", "staff", "trainer"].includes(role)) ? user : null; }

export async function POST(request: Request) {
  const user = await authorized(); if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = leadCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid lead details" }, { status: 400 });
  const { data, error } = await createClient().from("leads").insert({ ...parsed.data, assigned_to: user.id }).select("id").single();
  if (error) return NextResponse.json({ error: "Could not create lead" }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
