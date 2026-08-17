"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  CreateOrganizationInput,
  UpdateOrganizationInput,
  OrganizationRole,
} from "./types";
import { validateOrganizationInput } from "./validation";

type ActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

async function requireUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      supabase,
      user: null,
    };
  }

  return {
    supabase,
    user,
  };
}

export async function createOrganization(
  input: CreateOrganizationInput
): Promise<
  | {
      success: true;
      slug: string;
    }
  | {
      success: false;
      error: string;
    }
> {
  const { supabase, user } = await requireUser();

  if (!user) {
    return {
      success: false,
      error: "You must be signed in.",
    };
  }

  const validation = validateOrganizationInput(input);

  if (!validation.success) {
    return validation;
  }

  const { data, error } = await supabase.rpc(
    "create_organization",
    {
      p_name: validation.data.name,
      p_slug: validation.data.slug,
      p_description: validation.data.description,
    }
  );

  if (error) {
    console.error("createOrganization:", error);

    if (error.code === "23505") {
      return {
        success: false,
        error: "That organization slug is already in use.",
      };
    }

    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/organizations");

  return {
    success: true,
    slug: data.slug,
  };
}

export async function updateOrganization(
  organizationId: string,
  input: UpdateOrganizationInput
): Promise<ActionResult> {
  const { supabase, user } = await requireUser();

  if (!user) {
    return {
      success: false,
      error: "You must be signed in.",
    };
  }

  const validation = validateOrganizationInput(input);

  if (!validation.success) {
    return validation;
  }

  const { error } = await supabase
    .from("organizations")
    .update({
      name: validation.data.name,
      slug: validation.data.slug,
      description: validation.data.description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", organizationId);

  if (error) {
    console.error("updateOrganization:", error);

    if (error.code === "23505") {
      return {
        success: false,
        error: "That organization slug is already in use.",
      };
    }

    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/organizations");
  revalidatePath(
    `/organizations/${validation.data.slug}`
  );

  return {
    success: true,
  };
}

export async function updateMemberRole(
  organizationId: string,
  memberId: string,
  role: OrganizationRole
): Promise<ActionResult> {
  const { supabase, user } = await requireUser();

  if (!user) {
    return {
      success: false,
      error: "You must be signed in.",
    };
  }

  if (!["admin", "editor", "member"].includes(role)) {
    return {
      success: false,
      error: "Invalid member role.",
    };
  }

  const { error } = await supabase
    .from("organization_members")
    .update({
      role,
    })
    .eq("id", memberId)
    .eq("organization_id", organizationId);

  if (error) {
    console.error("updateMemberRole:", error);

    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath(
    `/organizations/${organizationId}/members`
  );

  return {
    success: true,
  };
}

export async function removeMember(
  organizationId: string,
  memberId: string
): Promise<ActionResult> {
  const { supabase, user } = await requireUser();

  if (!user) {
    return {
      success: false,
      error: "You must be signed in.",
    };
  }

  const { error } = await supabase
    .from("organization_members")
    .delete()
    .eq("id", memberId)
    .eq("organization_id", organizationId);

  if (error) {
    console.error("removeMember:", error);

    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath(
    `/organizations/${organizationId}/members`
  );

  return {
    success: true,
  };
}

export async function deleteOrganization(
  organizationId: string
): Promise<ActionResult> {
  const { supabase, user } = await requireUser();

  if (!user) {
    return {
      success: false,
      error: "You must be signed in.",
    };
  }

  const { error } = await supabase
    .from("organizations")
    .delete()
    .eq("id", organizationId);

  if (error) {
    console.error("deleteOrganization:", error);

    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/organizations");

  redirect("/organizations");
}
