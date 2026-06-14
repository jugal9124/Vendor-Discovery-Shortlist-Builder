import { useState } from "react";
import MatchBadge from "./MatchBadge.jsx";
import ScoreBar from "./ScoreBar.jsx";

export default function VendorCard({ vendor, rank }) {
  const [expanded, setExpanded] = useState(rank === 1);

  return (
    <div className={`bg-slate-900 border rounded-2xl overflow-hidden fade-in ${rank === 1 ? "border-brand-600/60" : "border-slate-800"}`}>
      {/* Header */}
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold
            ${rank === 1 ? "bg-brand-600 text-white" : "bg-slate-800 text-slate-400"}`}>
            {rank}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-white text-lg">{vendor.name}</h3>
              {rank === 1 && (
                <span className="text-xs bg-brand-600/20 text-brand-400 border border-brand-600/40 px-2 py-0.5 rounded-full font-medium">
                  Top Pick
                </span>
              )}
              {vendor.scrapedSuccessfully && (
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">✓ Live data</span>
              )}
            </div>
            <p className="text-slate-400 text-sm mt-0.5">{vendor.summary}</p>
          </div>
        </div>
        <button onClick={() => setExpanded((e) => !e)}
          className="text-slate-500 hover:text-white transition-colors flex-shrink-0 mt-1">
          <svg className={`w-5 h-5 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Score + price bar */}
      <div className="px-5 pb-3 grid grid-cols-2 gap-4 border-b border-slate-800">
        <div>
          <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Match Score</p>
          <ScoreBar score={vendor.score} />
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Price Range</p>
          <p className="text-sm font-medium text-white">{vendor.priceRange}</p>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 py-4 space-y-5">
          {/* Feature matches */}
          {vendor.featureMatches?.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-medium">
                Requirement Analysis
              </p>
              <div className="space-y-2">
                {vendor.featureMatches.map((fm, i) => (
                  <div key={i} className="bg-slate-800/60 rounded-xl p-3">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <p className="text-sm text-slate-200 font-medium">{fm.requirement}</p>
                      <MatchBadge match={fm.match} />
                    </div>
                    {fm.evidence && (
                      <p className="text-xs text-slate-400 italic">"{fm.evidence}"</p>
                    )}
                    {fm.evidenceUrl && (
                      <a href={fm.evidenceUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-brand-400 hover:text-brand-300 mt-1 inline-block truncate max-w-xs">
                        ↗ {fm.evidenceUrl}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risks */}
          {vendor.risks?.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">Risks</p>
              <ul className="space-y-1">
                {vendor.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-3 pt-1">
            {vendor.website && (
              <a href={vendor.website} target="_blank" rel="noopener noreferrer"
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors">
                Website ↗
              </a>
            )}
            {vendor.pricingUrl && vendor.pricingUrl !== vendor.website && (
              <a href={vendor.pricingUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs bg-brand-900/40 hover:bg-brand-900/60 text-brand-400 border border-brand-700/40 px-3 py-1.5 rounded-lg transition-colors">
                Pricing / Docs ↗
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
