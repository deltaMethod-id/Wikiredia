"use client";

import { useState } from "react";
import type { OrganizationRole } from "@/lib/organizations/types";
import { updateMemberRole } from "@/lib/organizations/actions";

type Props = {
  organizationId: string;
  memberId: string;
  role: OrganizationRole;
};

export function MemberRoleSelect({
  organizationId,
  memberId,
  role,
}: Props) {
  const [value, setValue] = useState(role);
  const [loading, setLoading] = useState(false);

  async function handleChange(
    nextRole: OrganizationRole
  ) {
    setValue(nextRole);
    setLoading(true);

    const result = await updateMemberRole(
      organizationId,
      memberId,
      nextRole
    );

    if (!result.success) {
      setValue(role);
    }

    setLoading(false);
  }

  if (role === "owner") {
    return <span className="role-badge">Owner</span>;
  }

  return (
    <select
      value={value}
      disabled={loading}
      onChange={(event) =>
        void handleChange(
          event.target.value as OrganizationRole
        )
      }
      aria-label="Member role"
    >
      <option value="admin">Administrator</option>
      <option value="editor">Editor</option>
      <option value="member">Member</option>
    </select>
  );
}
