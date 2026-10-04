// Local-only content store for the public /demo route.
// It reuses the same content layer as the real site (src/content), but never
// talks to Firebase. Edits live in memory and in this visitor's own browser
// (localStorage) — nothing is sent anywhere.

import { getLocalContentSnapshot, setSiteContent, setProjectsContent } from "../content";
import { normalizeProjects } from "../utils/projects";

const KEY_SITE = "nb_demo_site_v1";
const KEY_PROJECTS = "nb_demo_projects_v1";

const clone = (v) => JSON.parse(JSON.stringify(v));

const read = (key) => {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false; // storage full / blocked — edits still work in memory
  }
};

const remove = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
};

// The real owner email from the bundled content (never affected by visitor edits).
export const OWNER_EMAIL = getLocalContentSnapshot().site?.contact?.email || "";

// The project cards treat any non-"http" image path as a domain ("/uploads/x.png"
// becomes "https://uploads/x.png"), so bundled relative paths are made absolute.
const absolutize = (url) =>
  typeof url === "string" && url.startsWith("/") && typeof window !== "undefined"
    ? `${window.location.origin}${url}`
    : url;

export function getDemoContent() {
  const base = getLocalContentSnapshot();
  const site = read(KEY_SITE) ?? clone(base.site);
  const rawProjects = read(KEY_PROJECTS) ?? clone(base.projects);
  const projects = {
    ...rawProjects,
    projects: normalizeProjects(rawProjects.projects).map((p) => ({ ...p, image: absolutize(p?.image) })),
  };
  return { site, projects };
}

// Push demo content into the live content layer (the UI re-renders automatically).
export function loadDemoContent() {
  const content = getDemoContent();
  setSiteContent(content.site);
  setProjectsContent(content.projects);
  return content;
}

// Put the bundled content back when leaving /demo (live sync then takes over).
export function restoreBundledContent() {
  const base = getLocalContentSnapshot();
  setSiteContent(base.site);
  setProjectsContent(base.projects);
}

export function saveDemoSite(site) {
  setSiteContent(site);
  write(KEY_SITE, site);
}

export function saveDemoProjects(projects) {
  setProjectsContent(projects);
  write(KEY_PROJECTS, projects);
}

export function resetDemoContent() {
  remove(KEY_SITE);
  remove(KEY_PROJECTS);
  return loadDemoContent();
}
