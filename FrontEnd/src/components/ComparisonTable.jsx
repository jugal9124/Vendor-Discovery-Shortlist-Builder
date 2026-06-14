import MatchBadge from "./MatchBadge.jsx";

export default function ComparisonTable({ vendors, requirements }) {
  if (!vendors?.length) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-900 border-b border-slate-800">
            <th className="text-left px-4 py-3 text-slate-400 font-medium w-36">Requirement</th>
            {vendors.map((v) => (
              <th key={v.name} className="text-left px-4 py-3 text-white font-semibold min-w-36">
                <div>{v.name}</div>
                <div className="text-xs text-slate-400 font-normal">{v.priceRange}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {requirements.map((req, ri) => (
            <tr key={ri} className="border-b border-slate-800/60 hover:bg-slate-900/40 transition-colors">
              <td className="px-4 py-3 text-slate-300 font-medium">
                <div>{req.text}</div>
                <div className="text-xs text-slate-500 mt-0.5">weight {req.weight}/3</div>
              </td>
              {vendors.map((v) => {
                const fm = v.featureMatches?.find(
                  (f) => f.requirement?.toLowerCase() === req.text?.toLowerCase()
                ) || v.featureMatches?.[ri];
                return (
                  <td key={v.name} className="px-4 py-3">
                    <MatchBadge match={fm?.match || "none"} />
                    {fm?.evidence && (
                      <p className="text-xs text-slate-500 mt-1 italic max-w-40 line-clamp-2">"{fm.evidence}"</p>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
          {/* Score row */}
          <tr className="bg-slate-900">
            <td className="px-4 py-3 text-slate-400 font-semibold text-xs uppercase tracking-wider">
              Weighted Score
            </td>
            {vendors.map((v) => (
              <td key={v.name} className="px-4 py-3">
                <span className={`font-bold text-lg ${v.score >= 70 ? "text-emerald-400" : v.score >= 40 ? "text-amber-400" : "text-red-400"}`}>
                  {v.score}
                </span>
                <span className="text-slate-500 text-xs">/100</span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
