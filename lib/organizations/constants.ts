import type { OrganizationRole } from "./types";

export const ORGANIZATION_ROLES: OrganizationRole[] = [
  "owner",
  "admin",
  "editor",
  "member",
];

export const ORGANIZATION_ROLE_LABELS: Record<
  OrganizationRole,
  string
> = {
  owner: "Owner",
  admin: "Administrator",
  editor: "Editor",
  member: "Member",
};

export const ORGANIZATION_ROLE_DESCRIPTIONS: Record<
  OrganizationRole,
  string
> = {
  owner: "Full control over the organization.",
  admin: "Can manage members and organization content.",
  editor: "Can create and edit organization wikis.",
  member: "Can access organization content.",
};
