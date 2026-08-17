"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2 } from "lucide-react";
import { createOrganization } from "@/lib/organizations/actions";
import { normalizeOrganizationSlug } from "@/lib/organizations/validation";

export function CreateOrganizationForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleNameChange(
    value: string
  ) {
    setName(value);

    if (!slug) {
      setSlug(normalizeOrganizationSlug(value));
    }
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    void (async () => {
      setLoading(true);
      setError("");

      const result = await createOrganization({
        name,
        slug,
        description,
      });

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.push(
        `/organizations/${result.slug}`
      );
      router.refresh();
    })();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="organization-form"
    >
      <div className="form-field">
        <label htmlFor="organization-name">
          Organization name
        </label>

        <input
          id="organization-name"
          name="name"
          type="text"
          value={name}
          onChange={(event) =>
            handleNameChange(event.target.value)
          }
          maxLength={80}
          required
          autoComplete="organization"
          placeholder="Wikireadia Indonesia"
        />
      </div>

      <div className="form-field">
        <label htmlFor="organization-slug">
          Slug
        </label>

        <input
          id="organization-slug"
          name="slug"
          type="text"
          value={slug}
          onChange={(event) =>
            setSlug(
              normalizeOrganizationSlug(
                event.target.value
              )
            )
          }
          maxLength={60}
          required
          spellCheck={false}
          placeholder="wikireadia-indonesia"
        />

        <small>
          Your organization URL will use this slug.
        </small>
      </div>

      <div className="form-field">
        <label htmlFor="organization-description">
          Description
        </label>

        <textarea
          id="organization-description"
          name="description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          maxLength={500}
          rows={5}
          placeholder="Describe your organization..."
        />
      </div>

      {error && (
        <div
          className="form-error"
          role="alert"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="button"
      >
        {loading ? (
          <>
            <Loader2
              size={17}
              className="animate-spin"
            />
            Creating...
          </>
        ) : (
          <>
            <Building2 size={17} />
            Create Organization
          </>
        )}
      </button>
    </form>
  );
}
