import site from "./siteContent.json";
import projects from "./projectsContent.json";

// Single, stable import surface for the app.
// Components stay clean and you can swap the implementation later (CMS fetch) without rewriting UI.
export const siteContent = site;
export const projectsContent = projects;
