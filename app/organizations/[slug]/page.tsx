import { notFound, redirect } from "next/navigation";
import {
  getCurrentUser,
  getOrganizationBySlug,
  getOrganizationMemberRole,
} from "@/lib/organizations/queries";
import { OrganizationHeader } from "@/components/organization/organization-header";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props) {
  const { slug } = await params;

  const organization =
    await getOrganizationBySlug(slug);

  return {
    title: organization
      ? `${organization.name} | Wikireadia`
      : "Organization | Wikireadia",
  };
}

export default async function OrganizationPage({
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

  return (
    <main className="page-container">
      <OrganizationHeader
        organization={organization}
        role={role}
      />

      <section className="organization-overview">
        <h2>Organization Overview</h2>

        <p>
          Your role: <strong>{role}</strong>
        </p>

        <div className="organization-stats">
          <div>
            <strong>Organization</strong>
            <span>{organization.name}</span>
          </div>

          <div>
            <strong>Slug</strong>
            <span>{organization.slug}</span>
          </div>

          <div>
            <strong>Your role</strong>
            <span>{role}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
