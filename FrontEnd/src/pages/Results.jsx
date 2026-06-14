import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getShortlist } from "../api/client.js";
import VendorCard from "../components/VendorCard.jsx";
import ComparisonTable from "../components/ComparisonTable.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import Spinner from "../components/Spinner.jsx";

const POLL_INTERVAL = 3000;

const STEPS = [
  "Identifying vendors…",
  "Visiting pricing pages…",
  "Scraping vendor content…",
  "Analyzing requirements…",
  "Scoring and ranking…",
  "Generating comparison…",
];

export default function Results() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [view, setView] = useState("cards"); // "cards" | "table"
  const [stepIdx, setStepIdx] = useState(0);
  const timerRef = useRef(null);
  const stepTimerRef = useRef(null);

  useEffect(() => {
    let active = true;

    const poll = async () => {
      try {
        const { data: res } = await getShortlist(id);
        if (!active) return;
        setData(res);
        if (res.status === "processing") {
          timerRef.current = setTimeout(poll, POLL_INTERVAL);
        }
      } catch (err) {
        if (active) setError(err.message);
      }
    };

    poll();
    // Cycle through loading steps for UX
    stepTimerRef.current = setInterval(
      () => setStepIdx((i) => (i + 1) % STEPS.length),
      2500
    );

    return () => {
      active = false;
      clearTimeout(timerRef.current);
      clearInterval(stepTimerRef.current);
    };
  }, [id]);

  const downloadMarkdown = () => {
    if (!data?.markdownExport) return;
    const blob = new Blob([data.markdownExport], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shortlist-${id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) return <ErrorAlert error={error} />;

  if (!data || data.status === "processing") {
    return (
      <div className="max-w-2xl mx-auto text-center py-24">
        <div className="w-16 h-16 bg-brand-900/40 border border-brand-700/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-brand-400 spinner" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Building your shortlist</h2>
        <p className="text-brand-400 text-sm font-medium mb-1">{STEPS[stepIdx]}</p>
        <p className="text-slate-500 text-sm">
          AI is visiting vendor pages and analyzing your requirements.
          This takes 20–60 seconds.
        </p>
        <div className="flex justify-center gap-1 mt-6">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === stepIdx ? "w-6 bg-brand-500" : "w-2 bg-slate-700"}`} />
          ))}
        </div>
      </div>
    );
  }

  if (data.status === "error") {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-white mb-2">Research failed</h2>
        <p className="text-red-400 text-sm mb-6">{data.errorMessage || "Unknown error"}</p>
        <Link to="/" className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl transition-colors">
          Try again
        </Link>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Results</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{data.need}</h1>
          <p className="text-slate-400 text-sm mt-1">
            {data.vendors.length} vendors compared ·{" "}
            {data.requirements.length} requirements
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex bg-slate-800 rounded-xl p-1">
            {["cards", "table"].map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  view === v ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                }`}>
                {v === "cards" ? "📋 Cards" : "📊 Table"}
              </button>
            ))}
          </div>
          <button onClick={downloadMarkdown}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-3 py-2 rounded-xl transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export .md
          </button>
        </div>
      </div>

      {/* Requirements summary */}
      <div className="flex flex-wrap gap-2 mb-6">
        {data.requirements.map((r, i) => (
          <span key={i}
            className={`text-xs px-2.5 py-1 rounded-full border ${
              r.weight === 3
                ? "bg-brand-900/40 border-brand-700/40 text-brand-400"
                : r.weight === 2
                ? "bg-slate-800 border-slate-700 text-slate-300"
                : "bg-slate-900 border-slate-800 text-slate-500"
            }`}>
            {r.text}
            <span className="ml-1 opacity-60">·{r.weight}</span>
          </span>
        ))}
        {data.excludedVendors?.map((v) => (
          <span key={v} className="text-xs px-2.5 py-1 rounded-full border bg-red-950/20 border-red-900/40 text-red-500">
            ✕ {v}
          </span>
        ))}
      </div>

      {view === "cards" ? (
        <div className="space-y-4">
          {data.vendors.map((v, i) => (
            <VendorCard key={v.name} vendor={v} rank={i + 1} />
          ))}
        </div>
      ) : (
        <ComparisonTable vendors={data.vendors} requirements={data.requirements} />
      )}

      <div className="mt-6 text-center">
        <Link to="/history"
          className="text-sm text-slate-500 hover:text-white transition-colors">
          View all saved shortlists →
        </Link>
      </div>
    </div>
  );
}
