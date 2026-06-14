import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHistory, deleteShortlist } from "../api/client.js";
import ErrorAlert from "../components/ErrorAlert.jsx";
import Spinner from "../components/Spinner.jsx";
import ScoreBar from "../components/ScoreBar.jsx";

const SESSION_KEY = "vs_session_id";

export default function History() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sessionId = localStorage.getItem(SESSION_KEY) || "";

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    (async () => {
      try {
        const { data } = await getHistory(sessionId);
        setRecords(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId]);

  const handleDelete = async (id) => {
    try {
      await deleteShortlist(id);
      setRecords((r) => r.filter((x) => x._id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Shortlist History</h1>
          <p className="text-slate-400 text-sm mt-1">
            Last 5 shortlists · Session{" "}
            <code className="font-mono text-brand-400">{sessionId || "none"}</code>
          </p>
        </div>
        <Link to="/"
          className="bg-brand-600 hover:bg-brand-700 text-white text-sm px-4 py-2 rounded-xl transition-colors">
          + New Shortlist
        </Link>
      </div>

      <ErrorAlert error={error} onDismiss={() => setError("")} />

      {loading && <Spinner text="Loading history…" />}

      {!loading && !sessionId && (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-3">📭</p>
          <p>No session found. Build your first shortlist to start.</p>
          <Link to="/" className="mt-4 inline-block text-brand-500 hover:text-brand-400 text-sm">
            Build shortlist →
          </Link>
        </div>
      )}

      {!loading && sessionId && records.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-3">📋</p>
          <p>No shortlists yet in this session.</p>
          <Link to="/" className="mt-4 inline-block text-brand-500 hover:text-brand-400 text-sm">
            Build your first →
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {records.map((r) => (
          <div key={r._id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors fade-in">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Link to={`/results/${r._id}`}
                  className="font-semibold text-white hover:text-brand-400 transition-colors line-clamp-1">
                  {r.need}
                </Link>
                <p className="text-xs text-slate-500 mt-1">
                  {r.vendors?.length || 0} vendors · {r.requirements?.length || 0} requirements ·{" "}
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>

                {/* Top 3 vendors */}
                {r.vendors?.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {r.vendors.slice(0, 3).map((v, i) => (
                      <div key={v.name} className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 w-4">{i + 1}.</span>
                        <span className="text-sm text-slate-300 w-32 truncate">{v.name}</span>
                        <div className="flex-1">
                          <ScoreBar score={v.score} />
                        </div>
                        <span className="text-xs text-slate-500 w-20 text-right truncate">{v.priceRange}</span>
                      </div>
                    ))}
                  </div>
                )}

                {r.status === "processing" && (
                  <div className="mt-2">
                    <Spinner text="Still processing…" />
                  </div>
                )}
                {r.status === "error" && (
                  <p className="text-xs text-red-400 mt-2">⚠ Research failed</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link to={`/results/${r._id}`}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors">
                  View →
                </Link>
                <button onClick={() => handleDelete(r._id)}
                  className="text-slate-600 hover:text-red-400 transition-colors p-1.5"
                  title="Delete">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
