import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { Button, Card, HelperText, Input, PageFade } from "../components/UI";
import { isEmail } from "../utils/validate";

export default function LoginView({ notice = "" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password is required (min 6 chars).");
      return;
    }

    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(err?.message ?? "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <PageFade>
        <div className="w-full max-w-lg">
          <Card
            title="Admin Login"
            subtitle="Email/Password via Firebase Auth. Only users you create in Firebase can sign in."
          >
            {notice ? <HelperText tone="error">{notice}</HelperText> : null}
            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <div className="text-xs font-medium mb-1">Email</div>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" />
              </div>
              <div>
                <div className="text-xs font-medium mb-1">Password</div>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" type="password" placeholder="••••••••" />
              </div>

              {error ? <HelperText tone="error">{error}</HelperText> : null}

              <div className="pt-2">
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Signing in..." : "Login"}
                </Button>
              </div>

              <HelperText>
                Tip: if you get <span className="font-mono">auth/operation-not-allowed</span>, enable Email/Password sign-in in Firebase Console.
              </HelperText>
            </form>
          </Card>

          <div className="mt-4 text-xs text-slate-600 dark:text-slate-300 text-center">
            <a className="underline hover:opacity-80" href="/">Back to site</a>
          </div>
        </div>
      </PageFade>
    </div>
  );
}
