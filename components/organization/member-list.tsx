import type {
  OrganizationMemberView,
  OrganizationRole,
} from "@/lib/organizations/types";
import { MemberRoleSelect } from "./member-role-select";

type Props = {
  organizationId: string;
  members: OrganizationMemberView[];
  currentRole: OrganizationRole;
};

export function MemberList({
  organizationId,
  members,
  currentRole,
}: Props) {
  const canManage =
    currentRole === "owner" ||
    currentRole === "admin";

  return (
    <div className="member-list">
      {members.map((member) => (
        <div
          key={member.id}
          className="member-row"
        >
          <div>
            <strong>
              {member.email ||
                member.user_id}
            </strong>

            <small>
              Joined{" "}
              {new Date(
                member.created_at
              ).toLocaleDateString()}
            </small>
          </div>

          {canManage ? (
            <MemberRoleSelect
              organizationId={organizationId}
              memberId={member.id}
              role={member.role}
            />
          ) : (
            <span className="role-badge">
              {member.role}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
