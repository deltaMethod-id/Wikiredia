import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WikiEditor } from "@/components/wiki/wiki-editor";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  const supabase = await createClient();

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/settings");
  }

  const { data: organizations, error } = await supabase
    .from("organizations")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to load organizations:", error);
  }

  return (
    <main className="upload-page">
      <WikiEditor
        organizations={organizations ?? []}
      />
    </main>
  );
}