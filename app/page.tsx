import Link from "next/link";
import { ArrowRight, BookOpen, LockKeyhole, Users, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { WikiCard } from "@/components/wiki/wiki-card";
import type { Wiki } from "@/types/database";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.from("wikis").select("*").eq("is_published", true).order("updated_at", { ascending: false }).limit(8);
  const wikis = (data ?? []) as Wiki[];

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Knowledge infrastructure</span>
          <h1>Your organization’s wiki, <em>your rules.</em></h1>
          <p>Build, publish, and maintain documentation without giving edit access to people outside your organization.</p>
          <div className="hero-actions">
            <Link href="/upload" className="button primary">Create a wiki <ArrowRight size={17}/></Link>
            <Link href="/search" className="button secondary">Explore wikis</Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="panel-icon"><BookOpen/></div>
          <strong>Organization locked</strong>
          <span>Only authorized organization members can edit protected wikis.</span>
          <div className="security-line"><LockKeyhole size={16}/> Row Level Security</div>
        </div>
      </section>

      <section className="feature-grid">
        <div><Users/><h3>Organization permissions</h3><p>Owner, admin, editor, and member roles.</p></div>
        <div><UploadCloud/><h3>Flexible publishing</h3><p>Upload Markdown and publish structured wiki pages.</p></div>
        <div><LockKeyhole/><h3>Supabase RLS</h3><p>Permissions are enforced at the database layer.</p></div>
      </section>

      <section className="section">
        <div className="section-heading"><div><span className="eyebrow">Latest</span><h2>Recently updated</h2></div><Link href="/search">View all <ArrowRight size={16}/></Link></div>
        {wikis.length ? <div className="wiki-grid">{wikis.map(wiki => <WikiCard key={wiki.id} wiki={wiki}/>)}</div> : <div className="empty-state">No published wikis yet. Create the first one.</div>}
      </section>
    </div>
  );
}
