import { useEffect, useMemo, useState } from "react";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { projectsContent, siteContent, subscribeContent } from "../content";
import { saveProjectsContent, saveSiteContent, seedContentIfEmpty } from "../firebase/contentSync";

// Minimal admin: JSON editors (fast, stable, no UI redesign)
export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [siteJson, setSiteJson] = useState("");
  const [projectsJson, setProjectsJson] = useState("");
  const [status, setStatus] = useState("");

  // Keep editors in sync with live content (but don't overwrite while typing)
  useEffect(() => {
    const setFromCurrent = () => {
      setSiteJson(JSON.stringify(siteContent, null, 2));
      setProjectsJson(JSON.stringify(projectsContent, null, 2));
    };
    setFromCurrent();
    const unsub = subscribeContent(() => setFromCurrent());
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  const canEdit = !!user;

  async function handleLogin(e) {
    e.preventDefault();
    setStatus("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setStatus("Logged in.");
    } catch (err) {
      setStatus(err?.message ?? "Login failed.");
    }
  }

  async function handleLogout() {
    await signOut(auth);
  }

  async function handleSave() {
    setStatus("");
    try {
      const parsedSite = JSON.parse(siteJson);
      const parsedProjects = JSON.parse(projectsJson);

      await Promise.all([
        saveSiteContent(parsedSite),
        saveProjectsContent(parsedProjects),
      ]);

      setStatus("Saved. Live site should update instantly.");
    } catch (err) {
      setStatus(err?.message ?? "Save failed. Check your JSON format.");
    }
  }

  async function handleSeed() {
    setStatus("");
    try {
      await seedContentIfEmpty();
      setStatus("Seeded from local JSON.");
    } catch (err) {
      setStatus(err?.message ?? "Seed failed.");
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Admin</h1>
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 transition"
            >
              Logout
            </button>
          ) : null}
        </div>

        {!user ? (
          <form onSubmit={handleLogin} className="mt-6 max-w-md space-y-3">
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Login with the Firebase Auth user you created (Email/Password).
            </div>
            <input
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2 outline-none"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <input
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2 outline-none"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white hover:opacity-90 transition"
            >
              Login
            </button>
          </form>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:opacity-90 transition"
              >
                Save
              </button>
              <button
                onClick={handleSeed}
                className="px-4 py-2 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 transition"
              >
                Seed from local JSON
              </button>
              <a
                href="/"
                className="px-4 py-2 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 transition"
              >
                Back to site
              </a>
            </div>

            <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {status || "Tip: Keep JSON valid. Blank lines are allowed in arrays as empty strings."}
            </div>

            <div className="mt-6 grid lg:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-semibold mb-2">Site Content (siteContent.json)</div>
                <textarea
                  className="w-full h-[70vh] rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 font-mono text-xs outline-none"
                  value={siteJson}
                  onChange={(e) => setSiteJson(e.target.value)}
                  spellCheck={false}
                />
              </div>
              <div>
                <div className="text-sm font-semibold mb-2">Projects (projectsContent.json)</div>
                <textarea
                  className="w-full h-[70vh] rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 font-mono text-xs outline-none"
                  value={projectsJson}
                  onChange={(e) => setProjectsJson(e.target.value)}
                  spellCheck={false}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
