import Link from "next/link";
import {
  BookOpen,
  Building2,
  Search,
  Upload,
  Settings,
} from "lucide-react";

export function Header() {
  return (
    <header className="site-header">
      <Link
        href="/"
        className="brand"
        aria-label="Wikireadia Home"
      >
        <span className="brand-mark">
          <BookOpen size={18} />
        </span>

        <span>Wikireadia</span>
      </Link>

      <nav
        className="header-nav"
        aria-label="Main navigation"
      >
        <Link href="/search">
          <Search size={17} />
          <span>Search</span>
        </Link>

        <Link href="/organizations">
          <Building2 size={17} />
          <span>Organizations</span>
        </Link>

        <Link href="/upload">
          <Upload size={17} />
          <span>Upload</span>
        </Link>

        <Link href="/settings">
          <Settings size={17} />
          <span>Settings</span>
        </Link>
      </nav>
    </header>
  );
}
