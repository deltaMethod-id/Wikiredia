export type OrganizationRole =
  | "owner"
  | "admin"
  | "editor"
  | "member";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type OrganizationMember = {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrganizationRole;
  created_at: string;
};

export type OrganizationWithRole = Organization & {
  role: OrganizationRole;
};

export type OrganizationMemberView = OrganizationMember & {
  email: string | null;
};

export type CreateOrganizationInput = {
  name: string;
  slug: string;
  description?: string;
};

export type UpdateOrganizationInput = {
  name: string;
  slug: string;
  description?: string;
};
