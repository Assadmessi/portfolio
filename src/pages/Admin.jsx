import { useEffect, useState } from "react";
import { Head } from "@unhead/react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import AdminShell from "../admin/AdminShell";
import LoginView from "../admin/pages/LoginView";

// Admin route (/admin) is already gated in App.jsx.
// This file only concerns admin UI and does not touch public portfolio sections.
export default function Admin() {
  const [user, setUser] = useState(null);

  const allowedEmails = (import.meta.env.VITE_ADMIN_ALLOWED_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const isAllowed =
    !user || allowedEmails.length === 0
      ? true
      : allowedEmails.includes((user.email || "").toLowerCase());

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {/* keep same global tint as public site for consistency */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_55%)] dark:hidden" />
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_55%)]" />
      </div>

      {user && !isAllowed ? (
        <Unauthorized404
          email={user.email}
          onExit={async () => {
            try {
              await signOut(auth);
            } finally {
              window.location.href = "/";
            }
          }}
        />
      ) : user ? (
        <AdminShell />
      ) : (
        <LoginView />
      )}
    </div>
  );
}


function Unauthorized404({ email, onExit }) {
  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">404</h1>
      <p className="mt-3 text-slate-700 dark:text-slate-300">
        This page doesn’t exist.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5">
        <p className="text-sm text-slate-700 dark:text-slate-200">
          You’re signed in as <span className="font-mono">{email || "unknown"}</span>, but this account is not authorized to access the admin panel.
        </p>
        <button
          type="button"
          onClick={onExit}
          className="mt-4 inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white hover:opacity-90 dark:bg-white dark:text-slate-900"
        >
          Back to site
        </button>
      </div>
    </div>
  );
}
