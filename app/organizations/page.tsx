import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const supabase = await createClient();

  const {
    data: organizations,
    error,
  } = await supabase
    .from("organizations")
    .select("id, name, slug, description, created_by, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Organizations query failed:", error);
  }

  return (
    <main className="organizations-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Wikireadia</p>
          <h1>Organizations</h1>
          <p>
            Organizations manage their own wiki knowledge and members.
          </p>
        </div>

        <Link href="/organizations/create" className="button">
          <Plus size={18} />
          Create organization
        </Link>
      </section>

      {error ? (
        <section className="error-card">
          <h2>Could not load organizations</h2>
          <p>{error.message}</p>
        </section>
      ) : organizations && organizations.length > 0 ? (
        <section className="organization-grid">
          {organizations.map((organization) => (
            <Link
              key={organization.id}
              href={`/organizations/${organization.slug}`}
              className="organization-card"
            >
              <div className="organization-icon">
                <Building2 size={24} />
              </div>

              <div className="organization-content">
                <h2>{organization.name}</h2>

                <span className="organization-slug">
                  @{organization.slug}
                </span>

                <p>
                  {organization.description || "No description provided."}
                </p>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <Building2 size={42} />

          <h2>No organizations</h2>

          <p>
            You haven't created or joined an organization yet.
          </p>

          <Link href="/organizations/create" className="button">
            <Plus size={18} />
            Create organization
          </Link>
        </section>
      )}
    </main>
  );
}
