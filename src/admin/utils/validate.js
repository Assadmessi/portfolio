// Safe, minimal validators for admin forms.
// Keep this dependency-free so it works everywhere.

export function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

export function isEmail(v) {
  if (!isNonEmptyString(v)) return false;
  // Simple, permissive email check (Firebase will validate on sign-in anyway)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function isUrlOrHashOrRelative(v) {
  if (!isNonEmptyString(v)) return false;
  const s = v.trim();
  if (s.startsWith("#")) return true;
  if (s.startsWith("/")) return true; // allow site-relative paths like /resume.pdf
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeTags(input) {
  if (Array.isArray(input)) return input.map(String).map(s => s.trim()).filter(Boolean);
  if (!isNonEmptyString(input)) return [];
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function safeStringArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((x) => String(x ?? "").trim()).filter(Boolean);
}

export function clampLen(str, maxLen) {
  const s = String(str ?? "");
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

export function validateSite(site) {
  const errors = {};

  // links
  const links = site?.links ?? {};
  if (!isUrlOrHashOrRelative(links.resumeUrl ?? "/resume.pdf")) {
    errors["links.resumeUrl"] = "Resume URL must be https://, /relative-path, or #anchor.";
  }
  if (links.githubUrl && !isUrlOrHashOrRelative(links.githubUrl)) {
    errors["links.githubUrl"] = "GitHub URL must be valid.";
  }
  if (links.linkedinUrl && !isUrlOrHashOrRelative(links.linkedinUrl)) {
    errors["links.linkedinUrl"] = "LinkedIn URL must be valid.";
  }

  // hero
  const hero = site?.hero ?? {};
  if (!isNonEmptyString(hero.name)) errors["hero.name"] = "Name is required.";
  if (!isNonEmptyString(hero.headlineAccent)) errors["hero.headlineAccent"] = "Headline accent is required.";
  if (hero.photoUrl && !isUrlOrHashOrRelative(hero.photoUrl)) errors["hero.photoUrl"] = "Photo URL must be https:// or /relative-path.";
  if (!isNonEmptyString(hero.intro)) errors["hero.intro"] = "Intro is required.";
  if (hero.buttons?.primary?.href && !isUrlOrHashOrRelative(hero.buttons.primary.href)) errors["hero.buttons.primary.href"] = "Primary button href invalid.";
  if (hero.buttons?.secondary?.href && !isUrlOrHashOrRelative(hero.buttons.secondary.href)) errors["hero.buttons.secondary.href"] = "Secondary button href invalid.";

  // about
  const about = site?.about ?? {};
  if (!isNonEmptyString(about.title)) errors["about.title"] = "About title is required.";
  if (!Array.isArray(about.paragraphs) || about.paragraphs.length === 0) errors["about.paragraphs"] = "Add at least one paragraph.";

  // contact
  const contact = site?.contact ?? {};
  if (contact.email && !isEmail(contact.email)) errors["contact.email"] = "Contact email looks invalid.";

  // services
  const services = site?.services ?? {};
  if (!isNonEmptyString(services.sectionTitle)) errors["services.sectionTitle"] = "Services section title is required.";

  // howIWork
  const howIWork = site?.howIWork ?? {};
  if (!isNonEmptyString(howIWork.title)) errors["howIWork.title"] = "How I Work title is required.";

  // about.proofBlocks (optional)
  const blocks = about?.proofBlocks;
  if (Array.isArray(blocks)) {
    blocks.forEach((b, i) => {
      if (b?.title && !isNonEmptyString(b.title)) errors[`about.proofBlocks.${i}.title`] = "Title must be text.";
      if (b?.desc && !isNonEmptyString(b.desc)) errors[`about.proofBlocks.${i}.desc`] = "Description must be text.";
    });
  }

  return errors;
}

export function validateProjects(projectsDoc) {
  const errors = {};
  if (!isNonEmptyString(projectsDoc?.sectionTitle)) errors["sectionTitle"] = "Section title is required.";
  const items = projectsDoc?.projects;
  if (!Array.isArray(items)) errors["projects"] = "Projects must be an array.";
  else {
    items.forEach((p, idx) => {
      if (!isNonEmptyString(p?.title)) errors[`projects.${idx}.title`] = "Title required.";
      if (!isNonEmptyString(p?.desc)) errors[`projects.${idx}.desc`] = "Description required.";
      if (p?.image && !isUrlOrHashOrRelative(p.image)) errors[`projects.${idx}.image`] = "Thumbnail URL invalid.";
      if (p?.links?.live && !isUrlOrHashOrRelative(p.links.live)) errors[`projects.${idx}.links.live`] = "Live link invalid.";
      if (p?.links?.repo && !isUrlOrHashOrRelative(p.links.repo)) errors[`projects.${idx}.links.repo`] = "Repo link invalid.";
    });
  }
  // about.proofBlocks (optional)
  const blocks = about?.proofBlocks;
  if (Array.isArray(blocks)) {
    blocks.forEach((b, i) => {
      if (b?.title && !isNonEmptyString(b.title)) errors[`about.proofBlocks.${i}.title`] = "Title must be text.";
      if (b?.desc && !isNonEmptyString(b.desc)) errors[`about.proofBlocks.${i}.desc`] = "Description must be text.";
    });
  }

  return errors;
}
