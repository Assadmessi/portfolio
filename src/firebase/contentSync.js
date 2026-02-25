import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { setSiteContent, setProjectsContent, getLocalContentSnapshot } from "../content";

// Firestore locations (simple & predictable)
const SITE_DOC = doc(db, "portfolio", "site");
const PROJECTS_DOC = doc(db, "portfolio", "projects");

// Local cache keys (helps public reflect admin edits even if realtime listeners are blocked by rules)
const CACHE_SITE_KEY = "nb_siteContent_v1";
const CACHE_PROJECTS_KEY = "nb_projectsContent_v1";

function readCache(key) {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / private mode errors
  }
}


// Start realtime listeners. Returns an unsubscribe function.
export function startContentSync() {
  const unsubs = [];

  // Hydrate from local cache immediately (fast, offline-friendly)
  const cachedSite = readCache(CACHE_SITE_KEY);
  if (cachedSite) setSiteContent(cachedSite);
  const cachedProjects = readCache(CACHE_PROJECTS_KEY);
  if (cachedProjects) setProjectsContent(cachedProjects);

  unsubs.push(
    onSnapshot(
      SITE_DOC,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && data.site) {
            setSiteContent(data.site);
            writeCache(CACHE_SITE_KEY, data.site);
          }
        }
      },
      () => {
        console.warn("Content sync (site) failed. Public may fall back to bundled JSON/cache.");
      }
    )
  );

  unsubs.push(
    onSnapshot(
      PROJECTS_DOC,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && data.projects) {
            setProjectsContent(data.projects);
            writeCache(CACHE_PROJECTS_KEY, data.projects);
          }
        }
      },
      () => {
        console.warn("Content sync (projects) failed. Public may fall back to bundled JSON/cache.");
      }
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
  // Update UI immediately and persist to cache
  setSiteContent(site);
  writeCache(CACHE_SITE_KEY, site);
}

export async function saveProjectsContent(projects) {
  await setDoc(PROJECTS_DOC, { projects }, { merge: true });
  // Update UI immediately and persist to cache
  setProjectsContent(projects);
  writeCache(CACHE_PROJECTS_KEY, projects);
}
