import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WikiEditor } from "@/components/wiki/wiki-editor";

export default async function UploadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="container narrow"><div className="notice">Sign in before creating a wiki.</div></div>;

  async function createWiki(formData: FormData) {
    "use server";
    const server = await createClient();
    const { data: { user: current } } = await server.auth.getUser();
    if (!current) redirect("/");

    const title = String(formData.get("title") ?? "").trim();
    const summary = String(formData.get("summary") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const organizationId = String(formData.get("organization_id") ?? "").trim();

    const { data: membership } = await server.from("organization_members").select("role").eq("organization_id", organizationId).eq("user_id", current.id).maybeSingle();
    if (!membership || !["owner", "admin", "editor"].includes(membership.role)) throw new Error("You do not have permission to create wikis in this organization.");

    const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
    await server.from("wikis").insert({ organization_id: organizationId, author_id: current.id, slug, title, summary, content });
    redirect(`/wiki/${slug}`);
  }

  const { data: memberships } = await supabase.from("organization_members").select("organization_id, organizations(id,name,slug)").eq("user_id", user.id);

  return (
    <div className="container narrow">
      <section className="page-heading"><span className="eyebrow">Publishing</span><h1>Create a new wiki</h1><p>Only organizations where you have editor-level access can publish content.</p></section>
      <form action={createWiki} className="editor-shell">
        <label className="field">Organization
          <select name="organization_id" required>
            <option value="">Choose an organization</option>
            {(memberships ?? []).map((m: any) => <option key={m.organization_id} value={m.organization_id}>{m.organizations?.name}</option>)}
          </select>
        </label>
        <label className="field">Title<input name="title" required placeholder="Example: Internal API Guide"/></label>
        <label className="field">Summary<input name="summary" placeholder="What is this page about?"/></label>
        <label className="field">Markdown content<textarea name="content" rows={24} required placeholder="# Internal API Guide\n\nWrite your documentation here..."/></label>
        <button className="button primary">Publish wiki</button>
      </form>
    </div>
  );
}
