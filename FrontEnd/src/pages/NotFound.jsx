import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="text-center py-24">
      <p className="text-8xl font-bold text-slate-800 mb-4">404</p>
      <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
      <p className="text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl transition-colors">
        Go home
      </Link>
    </div>
  );
}
