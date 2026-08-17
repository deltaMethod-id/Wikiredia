"use client";

import { useState } from "react";
import { Save } from "lucide-react";

interface Props {
  initialTitle?: string;
  initialSummary?: string;
  initialContent?: string;
  onSave?: (data: { title: string; summary: string; content: string }) => Promise<void>;
}

export function WikiEditor({ initialTitle = "", initialSummary = "", initialContent = "", onSave }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [summary, setSummary] = useState(initialSummary);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!title.trim() || !content.trim() || !onSave) return;
    setSaving(true);
    try { await onSave({ title, summary, content }); }
    finally { setSaving(false); }
  }

  return (
    <section className="editor-shell">
      <div className="field">
        <label>Wiki title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a title..." />
      </div>
      <div className="field">
        <label>Summary</label>
        <input value={summary} onChange={e => setSummary(e.target.value)} placeholder="Short description..." />
      </div>
      <div className="field">
        <label>Markdown content</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="# Your wiki content..." rows={22}/>
      </div>
      <button className="button primary" onClick={submit} disabled={saving || !title.trim() || !content.trim()}>
        <Save size={17}/> {saving ? "Saving..." : "Save wiki"}
      </button>
    </section>
  );
}
