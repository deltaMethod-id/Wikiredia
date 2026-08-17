import Link from "next/link";
import {
  Building2,
  Settings,
  Users,
} from "lucide-react";
import type {
  Organization,
  OrganizationRole,
} from "@/lib/organizations/types";

type Props = {
  organization: Organization;
  role: OrganizationRole;
};

export function OrganizationHeader({
  organization,
  role,
}: Props) {
  const canManage =
    role === "owner" ||
    role === "admin";

  return (
    <header className="organization-header">
      <div>
        <div className="organization-title">
          <Building2 size={26} />
          <div>
            <h1>{organization.name}</h1>
            <p>@{organization.slug}</p>
          </div>
        </div>

        {organization.description && (
          <p className="organization-description">
            {organization.description}
          </p>
        )}
      </div>

      <nav className="organization-nav">
        <Link
          href={`/organizations/${organization.slug}`}
        >
          Overview
        </Link>

        <Link
          href={`/organizations/${organization.slug}/members`}
        >
          <Users size={16} />
          Members
        </Link>

        {canManage && (
          <Link
            href={`/organizations/${organization.slug}/settings`}
          >
            <Settings size={16} />
            Settings
          </Link>
        )}
      </nav>
    </header>
  );
}
