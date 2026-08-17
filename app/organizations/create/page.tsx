import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/organizations/queries";
import { CreateOrganizationForm } from "@/components/organization/create-organization-form";

export const metadata = {
  title: "Create Organization | Wikireadia",
};

export default async function CreateOrganizationPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/settings");
  }

  return (
    <main className="page-container narrow">
      <div className="page-heading">
        <div>
          <h1>Create Organization</h1>
          <p>
            Create a private workspace for your
            Wikireadia content.
          </p>
        </div>
      </div>

      <CreateOrganizationForm />
    </main>
  );
}
