"use client";

import { useState } from "react";

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface WikiEditorProps {
  organizations: Organization[];
}

export function WikiEditor({
  organizations,
}: WikiEditorProps) {
  const [organizationId, setOrganizationId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <form className="wiki-editor">
      <div className="form-group">
        <label htmlFor="organization">
          Organization
        </label>

        <select
          id="organization"
          name="organization_id"
          value={organizationId}
          onChange={(event) =>
            setOrganizationId(event.target.value)
          }
          required
        >
          <option value="">
            Select an organization
          </option>

          {organizations.map((organization) => (
            <option
              key={organization.id}
              value={organization.id}
            >
              {organization.name} (@{organization.slug})
            </option>
          ))}
        </select>

        {organizations.length === 0 && (
          <p className="form-hint">
            You don't have any organizations yet.
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="title">Wiki title</label>

        <input
          id="title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter wiki title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content</label>

        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          placeholder="Write your wiki..."
          rows={15}
          required
        />
      </div>

      <button
        type="submit"
        disabled={!organizationId}
      >
        Create Wiki
      </button>
    </form>
  );
}