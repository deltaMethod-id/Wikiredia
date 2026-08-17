import { createClient } from "@/lib/supabase/server";
import { WikiCard } from "@/components/wiki/wiki-card";
import type { Wiki } from "@/types/database";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const supabase = await createClient();
  let query = supabase.from("wikis").select("*").eq("is_published", true).order("updated_at", { ascending: false });
  if (q) query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%`);
  const { data } = await query.limit(50);
  const wikis = (data ?? []) as Wiki[];

  return (
    <div className="container narrow">
      <section className="page-heading"><span className="eyebrow">Directory</span><h1>Search Wikireadia</h1><p>Find published knowledge across the organizations you can access.</p></section>
      <form className="search-box">
        <input name="q" defaultValue={q} placeholder="Search titles and summaries..." />
        <button className="button primary">Search</button>
      </form>
      <div className="wiki-grid">{wikis.map(wiki => <WikiCard key={wiki.id} wiki={wiki}/>)}</div>
    </div>
  );
}
