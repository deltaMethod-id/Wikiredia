import { notFound, redirect } from "next/navigation";
import {
  getCurrentUser,
  getOrganizationBySlug,
  getOrganizationMemberRole,
} from "@/lib/organizations/queries";
import { DeleteOrganizationForm } from "@/components/organization/delete-organization-form";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const metadata = {
  title: "Organization Settings | Wikireadia",
};

export default async function OrganizationSettingsPage({
  params,
}: Props) {
  const { slug } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect("/settings");
  }

  const organization =
    await getOrganizationBySlug(slug);

  if (!organization) {
    notFound();
  }

  const role =
    await getOrganizationMemberRole(
      organization.id
    );

  if (!role) {
    notFound();
  }

  if (role !== "owner" && role !== "admin") {
    return (
      <main className="page-container">
        <h1>Access denied</h1>
        <p>
          You do not have permission to manage
          this organization.
        </p>
      </main>
    );
  }

  return (
    <main className="page-container narrow">
      <h1>Organization Settings</h1>

      <section className="settings-section">
        <h2>{organization.name}</h2>

        <p>
          Slug: <strong>{organization.slug}</strong>
        </p>

        {organization.description && (
          <p>{organization.description}</p>
        )}
      </section>

      {role === "owner" && (
        <section className="danger-zone">
          <h2>Danger Zone</h2>

          <p>
            Deleting this organization is
            permanent.
          </p>

          <DeleteOrganizationForm
            organizationId={organization.id}
            organizationName={organization.name}
          />
        </section>
      )}
    </main>
  );
}
