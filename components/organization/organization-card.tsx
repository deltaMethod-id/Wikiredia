import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";
import type { OrganizationWithRole } from "@/lib/organizations/types";
import { ORGANIZATION_ROLE_LABELS } from "@/lib/organizations/constants";

type Props = {
  organization: OrganizationWithRole;
};

export function OrganizationCard({
  organization,
}: Props) {
  return (
    <Link
      href={`/organizations/${organization.slug}`}
      className="organization-card"
    >
      <div className="organization-card-icon">
        <Building2 size={22} />
      </div>

      <div className="organization-card-content">
        <h2>{organization.name}</h2>

        <p>
          {organization.description ||
            "No description provided."}
        </p>

        <span>
          {ORGANIZATION_ROLE_LABELS[organization.role]}
        </span>
      </div>

      <ChevronRight size={20} />
    </Link>
  );
}
