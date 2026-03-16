export const normalizeProjects = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.items)) return raw.items;
  if (typeof raw === "object") {
    return Object.entries(raw)
      .filter(([k]) => k !== "items")
      .sort(([a], [b]) => {
        const na = Number(a);
        const nb = Number(b);
        if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
        return String(a).localeCompare(String(b));
      })
      .map(([, v]) => v);
  }
  return [];
};

export const getProjectKey = (p, i) => String(p?.id ?? p?.slug ?? p?.title ?? i);

export const getProjectDesc = (p) => p?.description ?? p?.desc ?? "";

export const getProjectDateValue = (project) => {
  const raw =
    project?.date ??
    project?.publishedAt ??
    project?.createdAt ??
    project?.launchDate ??
    project?.updatedAt ??
    "";

  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
};

export const formatProjectDate = (project) => {
  const value = getProjectDateValue(project);
  if (!value) return "";

  try {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
};

export const sortProjects = (projects, sortBy = "latest") => {
  const arr = Array.isArray(projects) ? [...projects] : [];

  if (sortBy === "name-asc") {
    return arr.sort((a, b) =>
      String(a?.title ?? "").localeCompare(String(b?.title ?? ""), undefined, {
        sensitivity: "base",
      })
    );
  }

  if (sortBy === "name-desc") {
    return arr.sort((a, b) =>
      String(b?.title ?? "").localeCompare(String(a?.title ?? ""), undefined, {
        sensitivity: "base",
      })
    );
  }

  if (sortBy === "oldest") {
    return arr.sort((a, b) => {
      const aTime = getProjectDateValue(a);
      const bTime = getProjectDateValue(b);
      if (aTime == null && bTime == null) return 0;
      if (aTime == null) return 1;
      if (bTime == null) return -1;
      return aTime - bTime;
    });
  }

  return arr.sort((a, b) => {
    const aTime = getProjectDateValue(a);
    const bTime = getProjectDateValue(b);
    if (aTime == null && bTime == null) return 0;
    if (aTime == null) return 1;
    if (bTime == null) return -1;
    return bTime - aTime;
  });
};
