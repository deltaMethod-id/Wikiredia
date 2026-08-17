import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

interface OrganizationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const {
    data: organization,
    error,
  } = await supabase
    .from("organizations")
    .select(
      "id, name, slug, description, created_by, created_at"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Organization query failed:", error);
    notFound();
  }

  if (!organization) {
    notFound();
  }

  return (
    <main className="organization-page">
      <Link href="/organizations" className="back-link">
        <ArrowLeft size={17} />
        Organizations
      </Link>

      <section className="organization-hero">
        <div className="organization-icon large">
          <Building2 size={34} />
        </div>

        <div>
          <h1>{organization.name}</h1>
          <p>@{organization.slug}</p>
        </div>
      </section>

      <section className="organization-description">
        <h2>About</h2>

        <p>
          {organization.description || "No description provided."}
        </p>
      </section>
    </main>
  );
}