import Link from "next/link";
import { BookOpen, Search, Upload, Settings } from "lucide-react";

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        <span className="brand-mark">W</span>
        <span>Wikireadia</span>
      </Link>
      <nav className="header-nav">
        <Link href="/search"><Search size={17}/> Search</Link>
        <Link href="/upload"><Upload size={17}/> Upload</Link>
        <Link href="/settings"><Settings size={17}/> Settings</Link>
      </nav>
    </header>
  );
}
