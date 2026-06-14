const configs = {
  full:    { label: "✓ Full",    cls: "bg-emerald-900/40 text-emerald-400 border-emerald-700/40" },
  partial: { label: "~ Partial", cls: "bg-amber-900/40 text-amber-400 border-amber-700/40" },
  none:    { label: "✗ None",   cls: "bg-red-900/40 text-red-400 border-red-700/40" },
};

export default function MatchBadge({ match }) {
  const cfg = configs[match] || configs.none;
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}
