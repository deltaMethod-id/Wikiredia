import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function OrganizationsPage() {
  const supabase = await createClient();

  const { data: organizations, error } = await supabase
    .from("organizations")
    .select("id, name, slug, description, created_by, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load organizations:", error);
  }

  return (
    <main className="organizations-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Wikireadia</p>
          <h1>Organizations</h1>
          <p>
            Browse organizations and discover their wiki knowledge.
          </p>
        </div>

        <Link href="/organizations/create" className="button">
          <Plus size={18} />
          Create organization
        </Link>
      </div>

      {error ? (
        <div className="error-card">
          <h2>Unable to load organizations</h2>
          <p>{error.message}</p>
        </div>
      ) : organizations?.length ? (
        <div className="organization-grid">
          {organizations.map((organization) => (
            <Link
              key={organization.id}
              href={`/organizations/${organization.slug}`}
              className="organization-card"
            >
              <div className="organization-icon">
                <Building2 size={22} />
              </div>

              <div>
                <h2>{organization.name}</h2>

                <p className="organization-slug">
                  @{organization.slug}
                </p>

                {organization.description && (
                  <p className="organization-description">
                    {organization.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Building2 size={40} />

          <h2>No organizations yet</h2>

          <p>
            Create the first Wikireadia organization.
          </p>

          <Link href="/organizations/create" className="button">
            <Plus size={18} />
            Create organization
          </Link>
        </div>
      )}
    </main>
  );
}
