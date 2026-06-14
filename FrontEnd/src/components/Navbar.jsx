import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const link = (to, label) => (
    <Link to={to}
      className={`text-sm transition-colors ${pathname === to ? "text-white" : "text-slate-400 hover:text-white"}`}>
      {label}
    </Link>
  );
  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2 font-semibold text-white hover:text-brand-500 transition-colors">
          <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Vendor Shortlist
        </Link>
        <div className="flex items-center gap-5">
          {link("/", "Build")}
          {link("/history", "History")}
          {link("/status", "Status")}
        </div>
      </div>
    </nav>
  );
}
