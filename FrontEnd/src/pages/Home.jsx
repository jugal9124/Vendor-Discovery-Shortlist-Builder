import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildShortlist } from "../api/client.js";
import ErrorAlert from "../components/ErrorAlert.jsx";
import Spinner from "../components/Spinner.jsx";

const SESSION_KEY = "vs_session_id";

function getOrCreateSession() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2, 10);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

const WEIGHT_LABELS = { 1: "Low", 2: "Medium", 3: "High" };

export default function Home() {
  const navigate = useNavigate();
  const [need, setNeed] = useState("");
  const [requirements, setRequirements] = useState([
    { text: "", weight: 2 },
    { text: "", weight: 2 },
    { text: "", weight: 2 },
  ]);
  const [excludedVendors, setExcludedVendors] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addReq = () => {
    if (requirements.length < 8)
      setRequirements((r) => [...r, { text: "", weight: 2 }]);
  };

  const removeReq = (i) =>
    setRequirements((r) => r.filter((_, idx) => idx !== i));

  const updateReq = (i, field, value) =>
    setRequirements((r) =>
      r.map((req, idx) => (idx === i ? { ...req, [field]: value } : req))
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filled = requirements.filter((r) => r.text.trim());
    if (!need.trim()) return setError("Please enter a need.");
    if (filled.length < 3) return setError("Please enter at least 3 requirements.");

    setError("");
    setLoading(true);
    try {
      const sessionId = getOrCreateSession();
      const excluded = excludedVendors
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

      const { data } = await buildShortlist({
        need: need.trim(),
        requirements: filled,
        excludedVendors: excluded,
        sessionId,
      });
      navigate(`/results/${data.id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-brand-900/40 border border-brand-700/40 text-brand-400 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
          AI visits real vendor pages · GPT-4o mini · MongoDB
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
          Find the right vendor,<br />
          <span className="text-brand-500">faster</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Describe what you need, set your requirements, and get a scored comparison
          table with real evidence from vendor docs and pricing pages.
        </p>
      </div>

      <ErrorAlert error={error} onDismiss={() => setError("")} />

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Need */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            What do you need?
          </label>
          <input
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            placeholder='e.g. "Email delivery service for India" or "Cloud object storage for a startup"'
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors text-sm"
          />
          {/* Example pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              "Email delivery service for India",
              "CI/CD platform for small teams",
              "Observability tool under $200/mo",
              "Headless CMS for a React app",
            ].map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setNeed(ex)}
                className="text-xs text-slate-500 hover:text-brand-400 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-medium text-slate-300">Requirements</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add 3–8 requirements. Set weight: Low (1) · Medium (2) · High (3)
              </p>
            </div>
            <button
              type="button"
              onClick={addReq}
              disabled={requirements.length >= 8}
              className="text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              + Add
            </button>
          </div>

          <div className="space-y-2">
            {requirements.map((req, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-slate-600 text-xs w-5 text-right flex-shrink-0">{i + 1}.</span>
                <input
                  value={req.text}
                  onChange={(e) => updateReq(i, "text", e.target.value)}
                  placeholder={`Requirement ${i + 1}…`}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors text-sm"
                />
                <select
                  value={req.weight}
                  onChange={(e) => updateReq(i, "weight", Number(e.target.value))}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors cursor-pointer"
                >
                  {[1, 2, 3].map((w) => (
                    <option key={w} value={w}>{WEIGHT_LABELS[w]}</option>
                  ))}
                </select>
                {requirements.length > 3 && (
                  <button
                    type="button"
                    onClick={() => removeReq(i)}
                    className="text-slate-600 hover:text-red-400 transition-colors p-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Exclusions (optional) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Exclude vendors{" "}
            <span className="text-slate-500 font-normal">(optional, comma-separated)</span>
          </label>
          <input
            value={excludedVendors}
            onChange={(e) => setExcludedVendors(e.target.value)}
            placeholder='e.g. "Mailchimp, Sendgrid"'
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2 text-base"
        >
          {loading ? (
            <Spinner text="Starting research pipeline…" />
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Build Shortlist
            </>
          )}
        </button>
      </form>

      {/* How it works */}
      <div className="mt-16 grid sm:grid-cols-4 gap-4">
        {[
          ["1", "Describe", "Enter your need and requirements with priority weights"],
          ["2", "Research", "AI identifies vendors and fetches their pricing pages"],
          ["3", "Analyze", "GPT scores each vendor against your requirements"],
          ["4", "Compare", "View ranked table with evidence quotes and risk flags"],
        ].map(([num, title, desc]) => (
          <div key={num} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
            <div className="w-7 h-7 bg-brand-600 rounded-full text-white text-sm font-bold flex items-center justify-center mx-auto mb-2">
              {num}
            </div>
            <h3 className="font-medium text-white text-sm mb-1">{title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
