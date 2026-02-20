import { useEffect, useMemo, useState } from "react";
import { projectsContent, subscribeContent } from "../../content";
import { saveProjectsContent } from "../../firebase/contentSync";
import { deepClone, deepEqual } from "../utils/deep";
import { Button, Card, HelperText, Input, PageFade, Textarea, Badge } from "../components/UI";
import { normalizeTags, validateProjects } from "../utils/validate";
import StorageUpload from "../components/StorageUpload";
import CloudinaryUpload from "../components/CloudinaryUpload";
import { DEFAULT_ICON_KEYS } from "../../components/common/IconLibrary";

function emptyProject() {
  return {
    title: "",
    desc: "",
    image: "",
    tags: [],
    links: { live: "", repo: "", pdf: "" },
    problem: "",
    system: "",
    solution: "",
    impact: "",
  };
}




function looksLikeDirectImageUrl(url) {
  if (!url) return true; // empty allowed
  const s = String(url).trim();
  // allow common direct image extensions
  if (/\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(s)) return true;

  // allow Cloudinary delivery URLs even without extensions
  try {
    const u = new URL(s);
    const host = u.hostname.toLowerCase();
    if (host.includes("res.cloudinary.com")) return true;
    if (host.includes("imagekit.io") || host.includes("ik.imagekit.io")) return true;
    if (host.includes("cdn.jsdelivr.net")) return true;
  } catch {
    // ignore
  }
  return false;
}

/**
 * Cloudinary normalizer (admin-only):
 * - Converts plain Cloudinary delivery URLs into a "fill" variant that looks good on mobile + desktop
 * - Upgrades older "pad" URLs (that cause the image to look small/centered on mobile) into "fill"
 * - Leaves already-transformed Cloudinary URLs untouched
 * - Leaves non-Cloudinary URLs untouched
 */
function normalizeCloudinaryUrl(url) {
  if (!url) return url;
  const s = String(url).trim();

  // Only touch Cloudinary delivery URLs (keeps other hosts untouched)
  if (!s.includes("res.cloudinary.com") || !s.includes("/image/upload/")) return s;

  // ✅ Upgrade old PAD URLs automatically (fixes "middle" on mobile)
  if (s.includes("/image/upload/c_pad")) {
    return s.replace(
      /\/image\/upload\/c_pad[^/]*\//,
      "/image/upload/c_fill,g_auto,w_1200,q_auto,f_auto/"
    );
  }

  // If the URL already has transformations (c_* etc), keep it as-is.
  // (Prevents double-applying or messing with user-provided transforms.)
  const afterUpload = s.split("/image/upload/")[1] ?? "";
  const firstSegment = afterUpload.split("/")[0] ?? "";
  const alreadyTransformed =
    firstSegment.includes(",") ||
    firstSegment.startsWith("c_") ||
    firstSegment.startsWith("ar_") ||
    firstSegment.startsWith("w_") ||
    firstSegment.startsWith("h_");

  if (alreadyTransformed) return s;

  // ✅ Responsive-friendly default (fills frame, no padding)
  // - c_fill,g_auto: fills frame with a smart crop
  // - w_1200: reasonable max width
  // - q_auto,f_auto: auto quality + best format
  const tx = "c_fill,g_auto,w_1200,q_auto,f_auto";

  return s.replace("/image/upload/", `/image/upload/${tx}/`);
}

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      next.projects = Array.isArray(next.projects) ? [...next.projects, emptyProject()] : [emptyProject()];
      return next;
    });
    setEditingIndex((draft?.projects?.length ?? 0));
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
      const temp = arr[idx];
      arr[idx] = arr[to];
      arr[to] = temp;
      next.projects = arr;
      return next;
    });
    setEditingIndex((cur) => {
      if (cur === idx) return idx + dir;
      if (cur === idx + dir) return idx;
      return cur;
    });
  }

  async function save() {
    setToast("");
    const nextDraft = deepClone(draft);

    nextDraft.projects = (nextDraft.projects ?? []).map((p) => ({
      ...p,
      title: String(p.title ?? ""),
      desc: String(p.desc ?? ""),
      image: normalizeCloudinaryUrl(String(p.image ?? "")),
      tags: normalizeTags(p.tags),
      links: {
        live: String(p.links?.live ?? ""),
        repo: String(p.links?.repo ?? ""),
        pdf: String(p.links?.pdf ?? ""),
      },
      problem: String(p.problem ?? ""),
      system: String(p.system ?? ""),
      solution: String(p.solution ?? ""),
      impact: String(p.impact ?? ""),
desc: String(it?.desc ?? ""),
        iconKey: String(it?.iconKey ?? "spark"),
        iconUrl: normalizeCloudinaryUrl(String(it?.iconUrl ?? "")),
      })),
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
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xl font-bold">Projects</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Manage <span className="font-mono">portfolio/projects</span> — add/edit/delete and reorder. Save to publish instantly.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" type="button" onClick={addProject}>+ Add</Button>
            <Button variant="ghost" type="button" onClick={reset} disabled={!dirty || busy}>Reset</Button>
            <Button type="button" onClick={save} disabled={!dirty || busy}>{busy ? "Saving..." : "Save"}</Button>
          </div>
        </div>

        {toast ? <HelperText tone={toast.includes("Saved") ? "success" : toast.includes("Fix") ? "error" : "neutral"}>{toast}</HelperText> : null}

        <Card title="Section title" subtitle="Shown above your projects on the public site.">
          <Input value={draft?.sectionTitle ?? ""} onChange={(e) => setSectionTitle(e.target.value)} />
          {errors["sectionTitle"] ? <HelperText tone="error">{errors["sectionTitle"]}</HelperText> : null}
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card title="Projects list" subtitle="Select a project to edit. Use arrows to reorder.">
            <div className="space-y-2">
              {items.length === 0 ? (
                <div className="text-sm text-slate-600 dark:text-slate-300">No projects yet. Click “Add”.</div>
              ) : null}

              {items.map((p, idx) => {
                const selected = idx === editingIndex;
                const hasErr = Object.keys(errors).some((k) => k.startsWith(`projects.${idx}.`));
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setEditingIndex(idx)}
                    className={`w-full text-left rounded-2xl border px-4 py-3 transition ${
                      selected
                        ? "border-indigo-500/60 bg-indigo-500/10"
                        : "border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-2">
                          {p?.title?.trim?.() ? p.title : `Untitled #${idx + 1}`}
                          {hasErr ? <Badge>Needs fixes</Badge> : null}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{p?.desc ?? ""}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="ghost" type="button" onClick={(e) => { e.stopPropagation(); move(idx, -1); }} disabled={idx === 0}>
                          ↑
                        </Button>
                        <Button variant="ghost" type="button" onClick={(e) => { e.stopPropagation(); move(idx, 1); }} disabled={idx === items.length - 1}>
                          ↓
                        </Button>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card
            title={editingIndex >= 0 ? `Edit project #${editingIndex + 1}` : "Editor"}
            subtitle={editingIndex >= 0 ? "Update fields and save to publish." : "Select a project from the list."}
          >
            {editingIndex < 0 ? (
              <div className="text-sm text-slate-600 dark:text-slate-300">Pick a project to start editing.</div>
            ) : (
              (() => {
                const p = items[editingIndex] ?? emptyProject();
                const prefix = `projects.${editingIndex}.`;
                return (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-medium mb-1">Title</div>
                        <Input
                          value={p.title ?? ""}
                          onChange={(e) => setProject(editingIndex, { ...p, title: e.target.value })}
                        />
                        {errors[`${prefix}title`] ? <HelperText tone="error">{errors[`${prefix}title`]}</HelperText> : null}
                      </div>
                      <div>
                        <div className="text-xs font-medium mb-1">Thumbnail URL</div>
                        <Input
                          value={p.image ?? ""}
                          onChange={(e) => setProject(editingIndex, { ...p, image: e.target.value })}
                          onBlur={(e) => setProject(editingIndex, { ...p, image: normalizeCloudinaryUrl(e.target.value) })}
                          placeholder="https://... or /uploads/..."
                        />
                        {errors[`${prefix}image`] ? <HelperText tone="error">{errors[`${prefix}image`]}</HelperText> : null}
                        {p?.image && !looksLikeDirectImageUrl(p.image) ? (
                          <HelperText tone="neutral">
                            Note: this URL may not be a direct image link. Prefer a direct .jpg/.png/.webp URL or a Cloudinary delivery URL.
                          </HelperText>
                        ) : null}

                        {p?.image ? (
                          <div className="mt-2 overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5">
                            <img
                              src={normalizeCloudinaryUrl(p.image)}
                              alt="Thumbnail preview"
                              className="h-40 w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                            <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                              Live preview (if the URL is publicly accessible).
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="md:col-span-2 grid md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs font-medium mb-1">Live URL</div>
                          <Input
                            value={p.links?.live ?? ""}
                            onChange={(e) => setProject(editingIndex, { ...p, links: { ...(p.links ?? {}), live: e.target.value } })}
                            placeholder="https://..."
                          />
                          {errors[`${prefix}links.live`] ? <HelperText tone="error">{errors[`${prefix}links.live`]}</HelperText> : null}
                        </div>
                        <div>
                          <div className="text-xs font-medium mb-1">Repo URL</div>
                          <Input
                            value={p.links?.repo ?? ""}
                            onChange={(e) => setProject(editingIndex, { ...p, links: { ...(p.links ?? {}), repo: e.target.value } })}
                            placeholder="https://github.com/..."
                          />
                          {errors[`${prefix}links.repo`] ? <HelperText tone="error">{errors[`${prefix}links.repo`]}</HelperText> : null}
                        </div>
                        <div>
                          <div className="text-xs font-medium mb-1">PDF URL (Optional)</div>
                          <Input
                            value={p.links?.pdf ?? ""}
                            onChange={(e) => setProject(editingIndex, { ...p, links: { ...(p.links ?? {}), pdf: e.target.value } })}
                            placeholder="https://.../case-study.pdf"
                          />
                          {errors[`${prefix}links.pdf`] ? <HelperText tone="error">{errors[`${prefix}links.pdf`]}</HelperText> : null}
                          <div className="mt-2">
                            <CloudinaryUpload
                              folder="portfolio/files"
                              resourceType="raw"
                              allowedFormats={["pdf"]}
                              presetEnvKey="VITE_CLOUDINARY_RESUME_UPLOAD_PRESET"
                              onUploaded={(url) => setProject(editingIndex, { ...p, links: { ...(p.links ?? {}), pdf: url } })}
                            />
                          </div>
                        </div>
                      </div>

                      </div>

                      <div>
                        <div className="text-xs font-medium mb-1">Tags (comma separated)</div>
                        <Input
                          value={Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags ?? "")}
                          onChange={(e) => setProject(editingIndex, { ...p, tags: e.target.value })}
                          placeholder="React, Tailwind, ..."
                        />
                      </div>

                      

                    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
                      <div className="text-sm font-semibold">Upload image (recommended: Cloudinary)</div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        Upload here and auto-fill the Thumbnail URL. This is admin-only and does not change your public site code.
                      </div>
                      <div className="mt-3">
                        <CloudinaryUpload onUploaded={(url) => setProject(editingIndex, { ...p, image: normalizeCloudinaryUrl(url) })} />
                        <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                          Advanced: you can also use Firebase Storage if you have it enabled.
                        </div>
                        <div className="mt-2">
                          <StorageUpload onUploaded={(url) => setProject(editingIndex, { ...p, image: url })} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <Button variant="danger" type="button" onClick={() => removeProject(editingIndex)}>
                        Delete project
                      </Button>
                      <a href="/" className="text-sm underline hover:opacity-80 ml-auto">Preview public site</a>
                    </div>
                  </div>
                );
              })()
            )}
          </Card>
        </div>

        {Object.keys(errors).length ? (
          <Card title="Validation issues" subtitle="These must be fixed before saving.">
            <ul className="list-disc pl-5 text-sm">
              {Object.entries(errors).slice(0, 30).map(([k, v]) => (
                <li key={k} className="text-rose-600 dark:text-rose-400">{k}: {v}</li>
              ))}
            </ul>
            {Object.keys(errors).length > 30 ? <HelperText tone="warn">Showing first 30 issues.</HelperText> : null}
          </Card>
        ) : null}
      </div>
    </PageFade>
  );
}
