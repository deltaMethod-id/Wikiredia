export type Role = "owner" | "admin" | "editor" | "member";
export type Visibility = "public" | "organization" | "private";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Wiki {
  id: string;
  organization_id: string;
  author_id: string | null;
  slug: string;
  title: string;
  summary: string;
  content: string;
  visibility: Visibility;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
