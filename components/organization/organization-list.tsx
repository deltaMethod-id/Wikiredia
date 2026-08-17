import Link from "next/link";
import { Plus } from "lucide-react";
import type { OrganizationWithRole } from "@/lib/organizations/types";
import { OrganizationCard } from "./organization-card";

type Props = {
  organizations: OrganizationWithRole[];
};

export function OrganizationList({
  organizations,
}: Props) {
  if (organizations.length === 0) {
    return (
      <div className="organization-empty">
        <h2>No organizations yet</h2>

        <p>
          Create your first Wikireadia organization.
        </p>

        <Link
          href="/organizations/create"
          className="button"
        >
          <Plus size={17} />
          Create Organization
        </Link>
      </div>
    );
  }

  return (
    <div className="organization-list">
      {organizations.map((organization) => (
        <OrganizationCard
          key={organization.id}
          organization={organization}
        />
      ))}
    </div>
  );
}
