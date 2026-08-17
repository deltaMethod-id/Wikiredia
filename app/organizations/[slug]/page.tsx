import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface OrganizationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: organization, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !organization) {
    notFound();
  }

  return (
    <main className="organization-page">
      <div className="organization-header">
        <div className="organization-logo">
          {organization.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h1>{organization.name}</h1>
          <p>@{organization.slug}</p>
        </div>
      </div>

      {organization.description && (
        <section className="organization-description">
          <h2>About this organization</h2>
          <p>{organization.description}</p>
        </section>
      )}
    </main>
  );
}
