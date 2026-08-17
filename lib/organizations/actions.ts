"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type CreateOrganizationInput = {
  name: string;
  slug: string;
  description?: string;
};

export async function createOrganization(
  input: CreateOrganizationInput
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in.",
    };
  }

  const name = input.name.trim();
  const slug = input.slug.trim().toLowerCase();
  const description = input.description?.trim() || null;

  if (!name || !slug) {
    return {
      success: false,
      error: "Organization name and slug are required.",
    };
  }

  const { data: organization, error } = await supabase
    .from("organizations")
    .insert({
      name,
      slug,
      description,
    })
    .select("id, slug")
    .single();

  if (error || !organization) {
    return {
      success: false,
      error: error?.message ?? "Failed to create organization.",
    };
  }

  const { error: memberError } = await supabase
    .from("organization_members")
    .insert({
      organization_id: organization.id,
      user_id: user.id,
      role: "owner",
    });

  if (memberError) {
    await supabase
      .from("organizations")
      .delete()
      .eq("id", organization.id);

    return {
      success: false,
      error: memberError.message,
    };
  }

  redirect(`/organizations/${organization.slug}`);
}
