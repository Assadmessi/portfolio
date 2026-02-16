import site from "./siteContent.json";
import projects from "./projectsContent.json";

// Deep-merge helper: Firestore content should override defaults, but missing
// keys should fall back to local JSON so new fields appear automatically.
function isObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function deepMerge(defaults, incoming) {
  if (incoming === undefined || incoming === null) return defaults;
  if (Array.isArray(defaults)) {
    // Arrays: if Firestore provides an array, use it; otherwise keep defaults.
    return Array.isArray(incoming) ? incoming : defaults;
  }
  if (isObject(defaults)) {
    if (!isObject(incoming)) return defaults;
    const out = { ...defaults };
    for (const key of Object.keys(incoming)) {
      if (key in defaults) out[key] = deepMerge(defaults[key], incoming[key]);
      else out[key] = incoming[key];
    }
    return out;
  }
  // Primitives: prefer incoming when defined.
  return incoming;
}

// Live content bindings (components can keep importing { siteContent, projectsContent } unchanged).
export let siteContent = site;
export let projectsContent = projects;

// Simple pub/sub so App can re-render when content updates.
const listeners = new Set();

export function subscribeContent(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  for (const fn of listeners) fn();
}

export function setSiteContent(next) {
  siteContent = deepMerge(site, next);
  notify();
}

export function setProjectsContent(next) {
  projectsContent = deepMerge(projects, next);
  notify();
}

// For initial seeding / fallbacks
export function getLocalContentSnapshot() {
  return { site: site, projects: projects };
}
