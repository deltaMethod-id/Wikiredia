import { createClient } from "@/lib/supabase/server";

export type Role = "owner" | "admin" | "editor" | "member";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getOrgRole(organizationId: string): Promise<Role | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", organizationId)
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id ?? "")
    .maybeSingle();

  return (data?.role as Role | null) ?? null;
}

export function canEdit(role: Role | null) {
  return role === "owner" || role === "admin" || role === "editor";
}
