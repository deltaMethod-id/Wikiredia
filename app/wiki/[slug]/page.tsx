import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { markdownToHtml } from "@/lib/markdown";
import { canEdit, getOrgRole } from "@/lib/auth/permissions";

export default async function WikiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: wiki } = await supabase.from("wikis").select("*").eq("slug", slug).maybeSingle();
  if (!wiki) notFound();

  const role = await getOrgRole(wiki.organization_id);
  const html = await markdownToHtml(wiki.content);

  return (
    <div className="container article-layout">
      <article className="article">
        <div className="article-meta"><span className="eyebrow">Wikireadia</span><span>Updated {new Date(wiki.updated_at).toLocaleString()}</span></div>
        <h1>{wiki.title}</h1>
        <p className="article-summary">{wiki.summary}</p>
        <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <aside className="article-aside">
        <div className="side-card">
          <span className="eyebrow">Access</span>
          <strong>{role ? `Organization member · ${role}` : "Read only"}</strong>
          <p>Editing is controlled by organization membership and database policies.</p>
          {canEdit(role) && <Link href={`/wiki/${wiki.slug}/edit`} className="button primary full">Edit wiki</Link>}
        </div>
      </aside>
    </div>
  );
}
