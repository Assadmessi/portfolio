import { useEffect, useMemo, useState } from "react";
import { projectsContent, subscribeContent } from "../../content";
import { saveProjectsContent } from "../../firebase/contentSync";
import { deepClone, deepEqual } from "../utils/deep";
import { Button, Card, HelperText, Input, PageFade, Textarea, Badge } from "../components/UI";
import { normalizeTags, validateProjects } from "../utils/validate";
import StorageUpload from "../components/StorageUpload";

function emptyProject() {
  return {
    title: "",
    desc: "",
    image: "",
    tags: [],
    links: { live: "", repo: "" },
  };
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
      image: String(p.image ?? ""),
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
                          placeholder="https://... or /uploads/..."
                        />
                        {errors[`${prefix}image`] ? <HelperText tone="error">{errors[`${prefix}image`]}</HelperText> : null}
                      </div>

                      <div className="md:col-span-2">
                        <div className="text-xs font-medium mb-1">Description</div>
                        <Textarea
                          rows={4}
                          value={p.desc ?? ""}
                          onChange={(e) => setProject(editingIndex, { ...p, desc: e.target.value })}
                        />
                        {errors[`${prefix}desc`] ? <HelperText tone="error">{errors[`${prefix}desc`]}</HelperText> : null}
                      </div>

                      <div>
                        <div className="text-xs font-medium mb-1">Tags (comma separated)</div>
                        <Input
                          value={Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags ?? "")}
                          onChange={(e) => setProject(editingIndex, { ...p, tags: e.target.value })}
                          placeholder="React, Tailwind, ..."
                        />
                      </div>

                      <div>
                        <div className="text-xs font-medium mb-1">Links</div>
                        <div className="grid grid-cols-1 gap-2">
                          <Input
                            value={p?.links?.live ?? ""}
                            onChange={(e) => setProject(editingIndex, { ...p, links: { ...p.links, live: e.target.value } })}
                            placeholder="Live URL (optional)"
                          />
                          {errors[`${prefix}links.live`] ? <HelperText tone="error">{errors[`${prefix}links.live`]}</HelperText> : null}
                          <Input
                            value={p?.links?.repo ?? ""}
                            onChange={(e) => setProject(editingIndex, { ...p, links: { ...p.links, repo: e.target.value } })}
                            placeholder="Repo URL (optional)"
                          />
                          {errors[`${prefix}links.repo`] ? <HelperText tone="error">{errors[`${prefix}links.repo`]}</HelperText> : null}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
                      <div className="text-sm font-semibold">Optional: upload image to Firebase Storage</div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        If your Firebase Storage rules allow, you can upload here and auto-fill the Thumbnail URL.
                      </div>
                      <div className="mt-3">
                        <StorageUpload onUploaded={(url) => setProject(editingIndex, { ...p, image: url })} />
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
