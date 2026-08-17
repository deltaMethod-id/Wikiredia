import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canEdit, getOrgRole } from "@/lib/auth/permissions";

export default async function EditWikiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: wiki } = await supabase.from("wikis").select("*").eq("slug", slug).maybeSingle();
  if (!wiki) notFound();

  const role = await getOrgRole(wiki.organization_id);
  if (!canEdit(role)) return <div className="container narrow"><div className="notice danger">You do not have permission to edit this wiki.</div></div>;

  async function saveWiki(formData: FormData) {
    "use server";
    const server = await createClient();
    const { data: { user } } = await server.auth.getUser();
    if (!user) redirect("/");

    const currentRole = await getOrgRole(wiki.organization_id);
    if (!canEdit(currentRole)) throw new Error("Forbidden");

    const title = String(formData.get("title") ?? "").trim();
    const summary = String(formData.get("summary") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();

    await server.from("wiki_revisions").insert({ wiki_id: wiki.id, editor_id: user.id, title: wiki.title, summary: wiki.summary, content: wiki.content });
    await server.from("wikis").update({ title, summary, content }).eq("id", wiki.id);
    redirect(`/wiki/${wiki.slug}`);
  }

  return (
    <div className="container narrow">
      <section className="page-heading"><span className="eyebrow">Editor</span><h1>Edit {wiki.title}</h1></section>
      <form action={saveWiki} className="editor-shell">
        <label className="field">Title<input name="title" defaultValue={wiki.title} required/></label>
        <label className="field">Summary<input name="summary" defaultValue={wiki.summary}/></label>
        <label className="field">Markdown<textarea name="content" defaultValue={wiki.content} rows={26} required/></label>
        <button className="button primary">Save changes</button>
      </form>
    </div>
  );
}
