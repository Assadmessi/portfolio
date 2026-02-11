import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import AdminShell from "../admin/AdminShell";
import LoginView from "../admin/pages/LoginView";

// Admin route (/admin) is already gated in App.jsx.
// This file only concerns admin UI and does not touch public portfolio sections.
export default function Admin() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100">
      {/* keep same global tint as public site for consistency */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_55%)] dark:hidden" />
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_55%)]" />
      </div>

      {user ? <AdminShell /> : <LoginView />}
    </div>
  );
}
