import site from "./siteContent.json";
import projects from "./projectsContent.json";

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
  siteContent = next;
  notify();
}

export function setProjectsContent(next) {
  projectsContent = next;
  notify();
}

// For initial seeding / fallbacks
export function getLocalContentSnapshot() {
  return { site: site, projects: projects };
}
