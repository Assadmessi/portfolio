import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Button, Badge } from "./components/UI";
import SiteSettings from "./pages/SiteSettings";
import ProjectsManager from "./pages/ProjectsManager";
import { seedContentIfEmpty } from "../firebase/contentSync";

const tabs = [
  { id: "site", label: "Site settings" },
  { id: "projects", label: "Projects" },
];

export default function AdminShell() {
  const [tab, setTab] = useState("site");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  const active = useMemo(() => tabs.find((t) => t.id === tab) ?? tabs[0], [tab]);

  async function logout() {
    await signOut(auth);
  }

  async function seed() {
    setToast("");
    try {
      await seedContentIfEmpty();
      setToast("Seeded Firestore from local JSON (merge).");
    } catch (err) {
      setToast(err?.message ?? "Seed failed.");
    } finally {
      setTimeout(() => setToast(""), 3500);
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <Badge>Live Firestore</Badge>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Editing <span className="font-mono">portfolio/site</span> and <span className="font-mono">portfolio/projects</span>.
            </div>
            {toast ? <div className="text-xs mt-2 text-emerald-600 dark:text-emerald-400">{toast}</div> : null}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" type="button" onClick={seed}>Seed from local JSON</Button>
            <a href="/" className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 transition">
              Back to site
            </a>
            <Button variant="ghost" type="button" onClick={logout}>Logout</Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                tab === t.id
                  ? "border-indigo-500/60 bg-indigo-500/10"
                  : "border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
          <div className="ml-auto text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
            Signed in as <span className="font-mono">{user?.email ?? "—"}</span>
          </div>
        </div>

        {/* Content */}
        <div>
          {active.id === "site" ? <SiteSettings /> : null}
          {active.id === "projects" ? <ProjectsManager /> : null}
        </div>
      </div>
    </div>
  );
}
