import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Results from "./pages/Results.jsx";
import History from "./pages/History.jsx";
import Status from "./pages/Status.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/history" element={<History />} />
          {/* <Route path="/status" element={<Status />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        Vendor Shortlist Builder · MongoDB · Express · React · Node.js · GPT-4o mini
      </footer>
    </div>
  );
}
