import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { setSiteContent, setProjectsContent, getLocalContentSnapshot } from "../content";

// Firestore locations (simple & predictable)
const SITE_DOC = doc(db, "portfolio", "site");
const PROJECTS_DOC = doc(db, "portfolio", "projects");

// Start realtime listeners. Returns an unsubscribe function.
export function startContentSync() {
  const unsubs = [];

  unsubs.push(
    onSnapshot(
      SITE_DOC,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && data.site) setSiteContent(data.site);
        }
      },
      () => {
        // ignore listener errors in UI; admin can still work
      }
    )
  );

  unsubs.push(
    onSnapshot(
      PROJECTS_DOC,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && data.projects) setProjectsContent(data.projects);
        }
      },
      () => {}
    )
  );

  return () => unsubs.forEach((u) => u());
}

// Seed Firestore with local JSON (one-time setup)
export async function seedContentIfEmpty() {
  const { site, projects } = getLocalContentSnapshot();
  // Use merge so you can re-run safely
  await Promise.all([
    setDoc(SITE_DOC, { site }, { merge: true }),
    setDoc(PROJECTS_DOC, { projects }, { merge: true }),
  ]);
}

// Save from admin
export async function saveSiteContent(site) {
  await setDoc(SITE_DOC, { site }, { merge: true });
}

export async function saveProjectsContent(projects) {
  await setDoc(PROJECTS_DOC, { projects }, { merge: true });
}
