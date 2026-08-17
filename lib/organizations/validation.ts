import type {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from "./types";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeOrganizationSlug(slug: string) {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function validateOrganizationInput(
  input: CreateOrganizationInput | UpdateOrganizationInput
) {
  const name = input.name.trim();
  const slug = normalizeOrganizationSlug(input.slug);
  const description = input.description?.trim() || null;

  if (name.length < 2) {
    return {
      success: false as const,
      error: "Organization name must contain at least 2 characters.",
    };
  }

  if (name.length > 80) {
    return {
      success: false as const,
      error: "Organization name cannot exceed 80 characters.",
    };
  }

  if (!slug) {
    return {
      success: false as const,
      error: "Organization slug is required.",
    };
  }

  if (slug.length < 2) {
    return {
      success: false as const,
      error: "Organization slug must contain at least 2 characters.",
    };
  }

  if (slug.length > 60) {
    return {
      success: false as const,
      error: "Organization slug cannot exceed 60 characters.",
    };
  }

  if (!SLUG_REGEX.test(slug)) {
    return {
      success: false as const,
      error:
        "Slug may only contain lowercase letters, numbers, and hyphens.",
    };
  }

  if (description && description.length > 500) {
    return {
      success: false as const,
      error: "Description cannot exceed 500 characters.",
    };
  }

  return {
    success: true as const,
    data: {
      name,
      slug,
      description,
    },
  };
}
