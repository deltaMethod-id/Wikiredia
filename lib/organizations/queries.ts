import { createClient } from "@/lib/supabase/server";
import type {
  Organization,
  OrganizationMemberView,
  OrganizationWithRole,
} from "./types";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getUserOrganizations(): Promise<
  OrganizationWithRole[]
> {
  const supabase = await createClient();

  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("organization_members")
    .select(
      `
      role,
      organization:organizations (
        id,
        name,
        slug,
        description,
        created_at,
        updated_at
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error || !data) {
    console.error("getUserOrganizations:", error);
    return [];
  }

  return data
    .filter((item) => item.organization)
    .map((item) => ({
      ...(item.organization as unknown as Organization),
      role: item.role,
    }));
}

export async function getOrganizationBySlug(
  slug: string
): Promise<Organization | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organizations")
    .select(
      `
      id,
      name,
      slug,
      description,
      created_at,
      updated_at
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getOrganizationBySlug:", error);
    return null;
  }

  return data;
}

export async function getOrganizationMemberRole(
  organizationId: string,
  userId?: string
) {
  const supabase = await createClient();

  const user = userId
    ? { id: userId }
    : await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", organizationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.role;
}

export async function getOrganizationMembers(
  organizationId: string
): Promise<OrganizationMemberView[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organization_members")
    .select(
      `
      id,
      organization_id,
      user_id,
      role,
      created_at
    `
    )
    .eq("organization_id", organizationId)
    .order("created_at", {
      ascending: true,
    });

  if (error || !data) {
    console.error("getOrganizationMembers:", error);
    return [];
  }

  return data.map((member) => ({
    ...member,
    email: null,
  }));
}

export async function canManageOrganization(
  organizationId: string
) {
  const role = await getOrganizationMemberRole(organizationId);

  return role === "owner" || role === "admin";
}

export async function canEditOrganization(
  organizationId: string
) {
  const role = await getOrganizationMemberRole(organizationId);

  return (
    role === "owner" ||
    role === "admin"
  );
}
