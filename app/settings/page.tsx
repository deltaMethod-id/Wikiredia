import { createClient } from "@/lib/supabase/server";
import { AuthForm } from "@/components/auth/auth-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="container narrow">
      <section className="page-heading"><span className="eyebrow">Settings</span><h1>Account & platform</h1><p>Wikireadia uses Supabase Auth for account identity and organization access.</p></section>
      {user ? (
        <div className="settings-card">
          <span className="eyebrow">Signed in</span>
          <h2>{user.email}</h2>
          <p>Your organization memberships determine which protected wikis you can edit.</p>
          <form action={async () => {
            "use server";
            const server = await createClient();
            await server.auth.signOut();
          }}><button className="button secondary">Sign out</button></form>
        </div>
      ) : <AuthForm />}
    </div>
  );
}
