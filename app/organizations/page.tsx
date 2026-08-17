import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser, getUserOrganizations } from "@/lib/organizations/queries";
import { OrganizationList } from "@/components/organization/organization-list";

export const metadata = {
  title: "Organizations | Wikireadia",
  description:
    "Manage your Wikireadia organizations.",
};

export default async function OrganizationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/settings");
  }

  const organizations =
    await getUserOrganizations();

  return (
    <main className="page-container">
      <div className="page-heading">
        <div>
          <h1>Organizations</h1>
          <p>
            Create and manage your Wikireadia
            organizations.
          </p>
        </div>

        <Link
          href="/organizations/create"
          className="button"
        >
          <Plus size={17} />
          Create Organization
        </Link>
      </div>

      <OrganizationList
        organizations={organizations}
      />
    </main>
  );
}
