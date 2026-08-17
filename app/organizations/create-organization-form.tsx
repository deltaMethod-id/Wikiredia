"use client";

import { useState } from "react";
import { createOrganization } from "@/lib/organizations/actions";

export function CreateOrganizationForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const result = await createOrganization({
      name,
      slug,
      description,
    });

    if (!result.success) {
      setError(result.error);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="organization-form">
      <label>
        Organization name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label>
        Slug
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </label>

      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      {error && <p>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Organization"}
      </button>
    </form>
  );
}
