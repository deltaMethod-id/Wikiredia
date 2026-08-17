import { CreateOrganizationForm } from "@/components/organization/create-organization-form";

export default function CreateOrganizationPage() {
  return (
    <main className="container">
      <h1>Create Organization</h1>
      <p>Create a private Wikireadia organization.</p>

      <CreateOrganizationForm />
    </main>
  );
}
