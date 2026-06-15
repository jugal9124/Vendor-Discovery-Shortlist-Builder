import { useState, useEffect } from "react";
import { getHealth } from "../api/client.js";
import Spinner from "../components/Spinner.jsx";

// function Badge({ ok, label }) {
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
//         ok
//           ? "bg-emerald-900/40 text-emerald-400 border-emerald-700/40"
//           : "bg-red-900/40 text-red-400 border-red-700/40"
//       }`}
//     >
//       <span
//         className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`}
//       />
//       {label}
//     </span>
//   );
// }

export default function Status() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getHealth();
        setHealth(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // const fmt = (s) => {
  //   const h = String(Math.floor(s / 3600)).padStart(2, "0");
  //   const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  //   const sec = String(s % 60).padStart(2, "0");
  //   return `${h}:${m}:${sec}`;
  // };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">System Status</h1>
        <p className="text-slate-400 text-sm mt-1">
          Live health check for all services
        </p>
      </div>

      {loading && <Spinner text="Checking services…" />}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <p>{health}</p>
      {health && 
      <p>hello</p>
      // (
      //   <>
      //     <div
      //       className={`mb-8 flex items-center gap-3 p-4 rounded-xl border ${
      //         health.status === "ok"
      //           ? "bg-emerald-950/30 border-emerald-700/40"
      //           : "bg-red-950/30 border-red-700/40"
      //       }`}
      //     >
      //       <div
      //         className={`w-3 h-3 rounded-full ${health.status === "ok" ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`}
      //       />
      //       <span
      //         className={`font-semibold ${health.status === "ok" ? "text-emerald-300" : "text-red-300"}`}
      //       >
      //         {health.status === "ok"
      //           ? "All systems operational"
      //           : "Service degraded"}
      //       </span>
      //       <span className="ml-auto text-xs text-slate-500">
      //         {health.timestamp}
      //       </span>
      //     </div>

      //     <div className="grid sm:grid-cols-2 gap-4 mb-6">
      //       {[
      //         [
      //           "Express API",
      //           health.services.express === "ok",
      //           health.services.express,
      //           health,
      //           "Node.js REST server",
      //         ],
      //         [
      //           "MongoDB",
      //           health.services.mongodb === "connected",
      //           health.services.mongodb,
      //           "Mongoose ODM",
      //         ],
      //       ].map(([name, ok, status, desc]) => (
      //         <div
      //           key={name}
      //           className="bg-slate-900 border border-slate-800 rounded-xl p-5"
      //         >
      //           <div className="flex items-center justify-between mb-3">
      //             <span className="text-sm font-medium text-slate-300">
      //               {name}
      //             </span>
      //             <Badge ok={ok} label={status} />
      //           </div>
      //           <p className="text-2xl font-bold text-white">
      //             {ok ? "Online" : "Offline"}
      //           </p>
      //           <p className="text-xs text-slate-500 mt-1">{desc}</p>
      //         </div>
      //       ))}
      //     </div>

      //     <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      //       <div className="px-5 py-3 border-b border-slate-800">
      //         <h2 className="font-medium text-slate-300 text-sm">
      //           Environment
      //         </h2>
      //       </div>
      //       <div className="divide-y divide-slate-800">
      //         {[
      //           ["Uptime", fmt(health.uptime_seconds)],
      //           ["Node.js", health.node_version],
      //           ["Frontend", "React 18 + Vite"],
      //           ["AI Model", "GPT-4o mini (OpenAI)"],
      //           ["Styling", "Tailwind CSS via CDN"],
      //           ["Deployment", "Docker + Docker Compose"],
      //         ].map(([k, v]) => (
      //           <div
      //             key={k}
      //             className="flex items-center px-5 py-3 hover:bg-slate-800/30"
      //           >
      //             <span className="text-sm text-slate-400 w-32">{k}</span>
      //             <span className="text-sm text-slate-200 font-mono">{v}</span>
      //           </div>
      //         ))}
      //       </div>
      //     </div>

      //     <div className="mt-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      //       <div className="px-5 py-3 border-b border-slate-800">
      //         <h2 className="font-medium text-slate-300 text-sm">
      //           API Endpoints
      //         </h2>
      //       </div>
      //       <div className="divide-y divide-slate-800">
      //         {[
      //           ["POST", "/api/shortlist/build", "Start vendor research"],
      //           ["GET", "/api/shortlist/:id", "Poll shortlist status"],
      //           ["GET", "/api/shortlist/history/:sid", "Last 5 shortlists"],
      //           ["DELETE", "/api/shortlist/:id", "Delete a shortlist"],
      //           ["GET", "/api/health", "JSON health check"],
      //         ].map(([method, path, desc]) => (
      //           <div key={path} className="flex items-center px-5 py-3">
      //             <span
      //               className={`text-xs font-mono font-bold w-16 ${
      //                 method === "GET"
      //                   ? "text-emerald-400"
      //                   : method === "POST"
      //                     ? "text-blue-400"
      //                     : "text-red-400"
      //               }`}
      //             >
      //               {method}
      //             </span>
      //             <span className="text-sm font-mono text-slate-200 flex-1">
      //               {path}
      //             </span>
      //             <span className="text-xs text-slate-500">{desc}</span>
      //           </div>
      //         ))}
      //       </div>
      //     </div>
      //   </>
      // )
      }
    </div>
  );
}
