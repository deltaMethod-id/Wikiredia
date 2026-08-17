"use client";

import { useState } from "react";
import { deleteOrganization } from "@/lib/organizations/actions";

type Props = {
  organizationId: string;
  organizationName: string;
};

export function DeleteOrganizationForm({
  organizationId,
  organizationName,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${organizationName}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    const result = await deleteOrganization(
      organizationId
    );

    if (!result.success) {
      window.alert(result.error);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleDelete()}
      disabled={loading}
      className="danger-button"
    >
      {loading
        ? "Deleting..."
        : "Delete Organization"}
    </button>
  );
}
