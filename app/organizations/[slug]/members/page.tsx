import { notFound, redirect } from "next/navigation";
import {
  getCurrentUser,
  getOrganizationBySlug,
  getOrganizationMemberRole,
  getOrganizationMembers,
} from "@/lib/organizations/queries";
import { OrganizationHeader } from "@/components/organization/organization-header";
import { MemberList } from "@/components/organization/member-list";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const metadata = {
  title: "Members | Wikireadia",
};

export default async function MembersPage({
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

  const members =
    await getOrganizationMembers(
      organization.id
    );

  return (
    <main className="page-container">
      <OrganizationHeader
        organization={organization}
        role={role}
      />

      <section>
        <div className="page-heading">
          <div>
            <h2>Members</h2>
            <p>
              Manage people who belong to this
              organization.
            </p>
          </div>
        </div>

        <MemberList
          organizationId={organization.id}
          members={members}
          currentRole={role}
        />
      </section>
    </main>
  );
}
