import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import AdminShell from "../admin/AdminShell";
import LoginView from "../admin/pages/LoginView";

// Admin route (/admin) is already gated in App.jsx.
// This file only concerns admin UI and does not touch public portfolio sections.
export default function Admin() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [notice, setNotice] = useState("");

  // Lock down admin by email (and optional roles) without needing any extra database changes.
  // Set one of these env vars:
  //  - VITE_ADMIN_ALLOWED_EMAILS="a@b.com,c@d.com"
  //  - VITE_ADMIN_USERS="a@b.com:owner,c@d.com:editor"
  const allowed = useMemo(() => {
    const rawUsers = String(import.meta.env.VITE_ADMIN_USERS ?? "").trim();
    const rawEmails = String(import.meta.env.VITE_ADMIN_ALLOWED_EMAILS ?? "").trim();

    const map = new Map();
    if (rawUsers) {
      rawUsers
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((entry) => {
          const [email, role] = entry.split(":").map((x) => x.trim());
          if (email) map.set(email.toLowerCase(), role || "admin");
        });
    } else if (rawEmails) {
      rawEmails
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((email) => map.set(email.toLowerCase(), "admin"));
    }
    return map;
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setNotice("");
      setChecking(true);

      if (!u) {
        setUser(null);
        setChecking(false);
        return;
      }

      // If no allowlist is configured, keep current behavior (any Firebase Auth user can sign in).
      if (allowed.size === 0) {
        setUser(u);
        setChecking(false);
        return;
      }

      const email = String(u.email ?? "").toLowerCase();
      if (!email || !allowed.has(email)) {
        await signOut(auth);
        setUser(null);
        setNotice("Access denied. This account is not allowed to use the admin dashboard.");
        setChecking(false);
        return;
      }

      setUser(u);
      setChecking(false);
    });
    return unsub;
  }, [allowed]);

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100">
      {/* keep same global tint as public site for consistency */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_55%)] dark:hidden" />
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_55%)]" />
      </div>

      {checking ? (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-sm text-slate-600 dark:text-slate-300">Checking access…</div>
        </div>
      ) : user ? (
        <AdminShell />
      ) : (
        <LoginView notice={notice} />
      )}
    </div>
  );
}
