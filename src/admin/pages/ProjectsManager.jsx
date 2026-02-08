import { useEffect, useMemo, useState } from "react";
import { projectsContent, subscribeContent } from "../../content";
import { saveProjectsContent } from "../../firebase/contentSync";
import { deepClone, deepEqual } from "../utils/deep";
import { Button, Card, HelperText, Input, PageFade, Textarea, Badge } from "../components/UI";
import { normalizeTags, validateProjects } from "../utils/validate";
import StorageUpload from "../components/StorageUpload";
import CloudinaryUpload from "../components/CloudinaryUpload";

function emptyProject() {
  return {
    title: "",
    desc: "",
    image: "",
    tags: [],
    links: { live: "", repo: "" },
  };
}

function looksLikeDirectImageUrl(url) {
  if (!url) return true;
  const s = String(url).trim();
  if (/\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(s)) return true;

  try {
    const u = new URL(s);
    const host = u.hostname.toLowerCase();
    if (host.includes("res.cloudinary.com")) return true;
    if (host.includes("imagekit.io") || host.includes("ik.imagekit.io")) return true;
    if (host.includes("cdn.jsdelivr.net")) return true;
  } catch {}
  return false;
}

/* =========================================================
   ✅ ONLY CHANGE IS HERE
   ========================================================= */
function normalizeCloudinaryUrl(url) {
  if (!url) return url;
  const s = String(url).trim();

  // Only Cloudinary delivery URLs
  if (!s.includes("res.cloudinary.com") || !s.includes("/image/upload/")) return s;

  // 🔁 Upgrade old PAD URLs automatically
  if (s.includes("/image/upload/c_pad")) {
    return s.replace(
      /\/image\/upload\/c_pad[^/]*\//,
      "/image/upload/c_fill,g_auto,w_1200,q_auto,f_auto/"
    );
  }

  // If already transformed, leave it
  const afterUpload = s.split("/image/upload/")[1] ?? "";
  const firstSegment = afterUpload.split("/")[0] ?? "";
  const alreadyTransformed =
    firstSegment.includes(",") ||
    firstSegment.startsWith("c_") ||
    firstSegment.startsWith("ar_") ||
    firstSegment.startsWith("w_") ||
    firstSegment.startsWith("h_");

  if (alreadyTransformed) return s;

  // ✅ Responsive-friendly default
  const tx = "c_fill,g_auto,w_1200,q_auto,f_auto";

  return s.replace("/image/upload/", `/image/upload/${tx}/`);
}
/* ========================================================= */

export default function ProjectsManager() {
  const [draft, setDraft] = useState(() => deepClone(projectsContent));
  const [baseline, setBaseline] = useState(() => deepClone(projectsContent));
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(-1);

  useEffect(() => {
    const sync = () => {
      const next = deepClone(projectsContent);
      setBaseline(next);
      setDraft((d) => (deepEqual(d, baseline) ? next : d));
    };
    const unsub = subscribeContent(sync);
    sync();
    return unsub;
  }, [baseline]);

  const dirty = useMemo(() => !deepEqual(draft, baseline), [draft, baseline]);

  function reset() {
    setErrors({});
    setToast("Reset to last saved.");
    setDraft(deepClone(baseline));
    setEditingIndex(-1);
    setTimeout(() => setToast(""), 2500);
  }

  function setSectionTitle(v) {
    setDraft((p) => ({ ...deepClone(p), sectionTitle: v }));
  }

  function setProject(idx, nextProject) {
    setDraft((prev) => {
      const next = deepClone(prev);
      next.projects = Array.isArray(next.projects) ? [...next.projects] : [];
      next.projects[idx] = nextProject;
      return next;
    });
  }

  function addProject() {
    setDraft((prev) => {
      const next = deepClone(prev);
      next.projects = Array.isArray(next.projects)
        ? [...next.projects, emptyProject()]
        : [emptyProject()];
      return next;
    });
    setEditingIndex(draft?.projects?.length ?? 0);
  }

  function removeProject(idx) {
    setDraft((prev) => {
      const next = deepClone(prev);
      const arr = Array.isArray(next.projects) ? [...next.projects] : [];
      arr.splice(idx, 1);
      next.projects = arr;
      return next;
    });
    setEditingIndex(-1);
  }

  function move(idx, dir) {
    setDraft((prev) => {
      const next = deepClone(prev);
      const arr = Array.isArray(next.projects) ? [...next.projects] : [];
      const to = idx + dir;
      if (to < 0 || to >= arr.length) return prev;
      [arr[idx], arr[to]] = [arr[to], arr[idx]];
      next.projects = arr;
      return next;
    });
    setEditingIndex((cur) =>
      cur === idx ? idx + dir : cur === idx + dir ? idx : cur
    );
  }

  async function save() {
    setToast("");
    const nextDraft = deepClone(draft);

    nextDraft.projects = (nextDraft.projects ?? []).map((p) => ({
      ...p,
      image: normalizeCloudinaryUrl(String(p.image ?? "")),
      tags: normalizeTags(p.tags),
      links: {
        live: String(p.links?.live ?? ""),
        repo: String(p.links?.repo ?? ""),
      },
    }));

    const nextErrors = validateProjects(nextDraft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setToast("Fix validation errors before saving.");
      return;
    }

    setBusy(true);
    try {
      await saveProjectsContent(nextDraft);
      setToast("Saved. Live site updates instantly.");
    } catch (err) {
      setToast(err?.message ?? "Save failed.");
    } finally {
      setBusy(false);
      setTimeout(() => setToast(""), 3500);
    }
  }

  const items = Array.isArray(draft?.projects) ? draft.projects : [];

  return (
    <PageFade>
      {/* UI UNCHANGED */}
    </PageFade>
  );
}