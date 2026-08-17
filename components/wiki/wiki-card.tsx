import Link from "next/link";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import type { Wiki } from "@/types/database";

export function WikiCard({ wiki }: { wiki: Wiki }) {
  return (
    <Link href={`/wiki/${wiki.slug}`} className="wiki-card">
      <div className="wiki-card-top">
        <span className="eyebrow">Wiki</span>
        {wiki.visibility !== "public" && <LockKeyhole size={15}/>}
      </div>
      <h3>{wiki.title}</h3>
      <p>{wiki.summary || "No summary provided."}</p>
      <div className="wiki-card-footer">
        <span>{new Date(wiki.updated_at).toLocaleDateString()}</span>
        <ArrowUpRight size={17}/>
      </div>
    </Link>
  );
}
