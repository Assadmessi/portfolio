import { useEffect, useMemo, useState } from "react";
import { siteContent, subscribeContent } from "../../content";
import { saveSiteContent } from "../../firebase/contentSync";
import { deepClone, deepEqual } from "../utils/deep";
import { Button, Card, HelperText, Input, PageFade, Textarea } from "../components/UI";
import { normalizeTags, safeStringArray, validateSite } from "../utils/validate";
import CloudinaryUpload from "../components/CloudinaryUpload";
import StorageUpload from "../components/StorageUpload";

const PROOF_ICON_KEYS = ["ui","dashboard","rocket","shield","zap","sparkles","code","globe","wand"];

const DEFAULT_PROOF_BLOCKS = [
  { title: "UI + Motion", desc: "Smooth interactions, scroll reveals, and clean component systems.", iconKey: "ui" },
  { title: "Admin-ready UX", desc: "Dashboards, role-based flows, and content editing patterns.", iconKey: "dashboard" },
  { title: "Production mindset", desc: "Performance, maintainability, and deploy-friendly structure.", iconKey: "sparkles" },
];

function SectionHeader({ title, desc, right }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-semibold">{title}</div>
        {desc ? <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">{desc}</div> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export default function SiteSettings() {
  const [draft, setDraft] = useState(() => deepClone(siteContent));
  const [baseline, setBaseline] = useState(() => deepClone(siteContent));
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [errors, setErrors] = useState({});

  // Live updates from Firestore -> baseline. Only auto-merge when no unsaved edits.
  useEffect(() => {
    const sync = () => {
      const next = deepClone(siteContent);
      setBaseline(next);
      setDraft((d) => (deepEqual(d, baseline) ? next : d));
    };
    const unsub = subscribeContent(sync);
    sync();
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dirty = useMemo(() => !deepEqual(draft, baseline), [draft, baseline]);

  // Ensure default blocks exist so the admin UI is never empty on fresh Firestore.
  useEffect(() => {
    setDraft((prev) => {
      const next = deepClone(prev);
      if (!Array.isArray(next?.about?.proofBlocks) || next.about.proofBlocks.length === 0) {
        next.about = next.about ?? {};
        next.about.proofBlocks = deepClone(DEFAULT_PROOF_BLOCKS);
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setByPath(path, value) {
    setDraft((prev) => {
      const next = deepClone(prev);
      const parts = path.split(".");
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const k = parts[i];
        cur[k] = cur[k] ?? {};
        cur = cur[k];
      }
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  }

  function setArrayItem(path, index, value) {
    setDraft((prev) => {
      const next = deepClone(prev);
      const parts = path.split(".");
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        cur = cur[parts[i]];
      }
      const key = parts[parts.length - 1];
      const arr = Array.isArray(cur[key]) ? [...cur[key]] : [];
      arr[index] = value;
      cur[key] = arr;
      return next;
    });
  }

  function addToArray(path, value) {
    setDraft((prev) => {
      const next = deepClone(prev);
      const parts = path.split(".");
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      const key = parts[parts.length - 1];
      cur[key] = Array.isArray(cur[key]) ? [...cur[key], value] : [value];
      return next;
    });
  }

  function removeFromArray(path, idx) {
    setDraft((prev) => {
      const next = deepClone(prev);
      const parts = path.split(".");
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      const key = parts[parts.length - 1];
      const arr = Array.isArray(cur[key]) ? [...cur[key]] : [];
      arr.splice(idx, 1);
      cur[key] = arr;
      return next;
    });
  }

  function reset() {
    setErrors({});
    setToast("Reset to last saved.");
    setDraft(deepClone(baseline));
    setTimeout(() => setToast(""), 2500);
  }

  async function save() {
    setToast("");
    const nextDraft = deepClone(draft);

    // normalize a couple of known fields
    nextDraft.about = nextDraft.about ?? {};
    nextDraft.about.tags = normalizeTags(nextDraft.about.tags);
    nextDraft.about.paragraphs = safeStringArray(nextDraft.about.paragraphs);

    const nextErrors = validateSite(nextDraft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setToast("Fix validation errors before saving.");
      return;
    }

    setBusy(true);
    try {
      await saveSiteContent(nextDraft);
      setToast("Saved. Live site updates instantly.");
    } catch (err) {
      setToast(err?.message ?? "Save failed.");
    } finally {
      setBusy(false);
      setTimeout(() => setToast(""), 3500);
    }
  }

  const linkErrors = Object.entries(errors).filter(([k]) => k.startsWith("links."));

  return (
    <PageFade>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xl font-bold">Site Settings</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Edit content in <span className="font-mono">portfolio/site</span>. Your public site listens live, so changes appear instantly after saving.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" type="button" onClick={reset} disabled={!dirty || busy}>Reset</Button>
            <Button type="button" onClick={save} disabled={!dirty || busy}>{busy ? "Saving..." : "Save"}</Button>
          </div>
        </div>

        {toast ? <HelperText tone={toast.includes("Saved") ? "success" : toast.includes("Fix") ? "error" : "neutral"}>{toast}</HelperText> : null}
        {linkErrors.length ? (
          <Card title="Validation errors" subtitle="Fix these before saving.">
            <ul className="list-disc pl-5 text-sm">
              {linkErrors.map(([k, v]) => (
                <li key={k} className="text-rose-600 dark:text-rose-400">{k}: {v}</li>
              ))}
            </ul>
          </Card>
        ) : null}

        <Card title="Social & Resume Links" subtitle="These power footer links and the hero buttons.">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs font-medium mb-1">GitHub URL</div>
              <Input
                value={draft?.links?.githubUrl ?? ""}
                onChange={(e) => setByPath("links.githubUrl", e.target.value)}
                placeholder="https://github.com/..."
              />
              {errors["links.githubUrl"] ? <HelperText tone="error">{errors["links.githubUrl"]}</HelperText> : null}
            </div>
            <div>
              <div className="text-xs font-medium mb-1">LinkedIn URL</div>
              <Input
                value={draft?.links?.linkedinUrl ?? ""}
                onChange={(e) => setByPath("links.linkedinUrl", e.target.value)}
                placeholder="https://www.linkedin.com/in/..."
              />
              {errors["links.linkedinUrl"] ? <HelperText tone="error">{errors["links.linkedinUrl"]}</HelperText> : null}
            </div>
            <div>
              <div className="text-xs font-medium mb-1">Resume URL</div>
              <Input
                value={draft?.links?.resumeUrl ?? ""}
                onChange={(e) => setByPath("links.resumeUrl", e.target.value)}
                placeholder="/resume.pdf"
              />
              {errors["links.resumeUrl"] ? <HelperText tone="error">{errors["links.resumeUrl"]}</HelperText> : null}
              <div className="mt-2">
                <CloudinaryUpload
                  folder="portfolio/files"
                  resourceType="raw"
                  allowedFormats={["pdf"]}
                  presetEnvKey="VITE_CLOUDINARY_RESUME_UPLOAD_PRESET"
                  onUploaded={(url) => setByPath("links.resumeUrl", url)}
                />
                <HelperText>Upload your resume PDF to Cloudinary and auto-fill the URL.</HelperText>
              </div>

            </div>
          </div>
        </Card>

        <Card title="Hero" subtitle="Main headline, intro, CTAs.">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium mb-1">Name</div>
              <Input value={draft?.hero?.name ?? ""} onChange={(e) => setByPath("hero.name", e.target.value)} />
              {errors["hero.name"] ? <HelperText tone="error">{errors["hero.name"]}</HelperText> : null}
            </div>
            <div>
              <div className="text-xs font-medium mb-1">Badge</div>
              <Input value={draft?.hero?.badge ?? ""} onChange={(e) => setByPath("hero.badge", e.target.value)} placeholder="Junior Front-End Developer" />
            </div>
            <div>
              <div className="text-xs font-medium mb-1">Headline Accent</div>
              <Input value={draft?.hero?.headlineAccent ?? ""} onChange={(e) => setByPath("hero.headlineAccent", e.target.value)} placeholder="Front-End Developer" />
              {errors["hero.headlineAccent"] ? <HelperText tone="error">{errors["hero.headlineAccent"]}</HelperText> : null}
            </div>
            <div>
              <div className="text-xs font-medium mb-1">Availability</div>
              <Input value={draft?.hero?.availability ?? ""} onChange={(e) => setByPath("hero.availability", e.target.value)} placeholder="Open to freelance..." />
            </div>
            
            <div className="md:col-span-2">
              <div className="text-xs font-medium mb-1">Profile photo URL</div>
              <Input
                value={draft?.hero?.photoUrl ?? ""}
                onChange={(e) => setByPath("hero.photoUrl", e.target.value)}
                placeholder="/uploads/profile.jpg or https://..."
              />
              {errors["hero.photoUrl"] ? <HelperText tone="error">{errors["hero.photoUrl"]}</HelperText> : null}
              <div className="mt-2">
                <StorageUpload folder="portfolio/profile" onUploaded={(url) => setByPath("hero.photoUrl", url)} />
                <HelperText>Upload a profile image and auto-fill the URL.</HelperText>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs font-medium mb-1">Intro</div>
              <Textarea rows={3} value={draft?.hero?.intro ?? ""} onChange={(e) => setByPath("hero.intro", e.target.value)} />
              {errors["hero.intro"] ? <HelperText tone="error">{errors["hero.intro"]}</HelperText> : null}
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div>
                  <div className="text-xs font-medium">Hero mini cards</div>
                  <div className="text-xs opacity-70">These are the 3 small cards under your profile in the hero.</div>
                </div>
                <Button
                  type="button"
                  onClick={() => addToArray("hero.highlights", { title: "", subtitle: "" })}
                  disabled={(draft?.hero?.highlights?.length ?? 0) >= 6}
                >
                  Add card
                </Button>
              </div>

              <div className="space-y-3">
                {(draft?.hero?.highlights ?? []).slice(0, 6).map((h, idx) => (
                  <div key={idx} className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold">Card {idx + 1}</div>
                      <Button variant="ghost" type="button" onClick={() => removeFromArray("hero.highlights", idx)}>
                        Remove
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                      <div>
                        <div className="text-xs font-medium mb-1">Title</div>
                        <Input
                          value={h?.title ?? ""}
                          onChange={(e) => setArrayItem("hero.highlights", idx, { ...(h ?? {}), title: e.target.value })}
                          placeholder="UI"
                        />
                        {errors[`hero.highlights.${idx}.title`] ? (
                          <HelperText tone="error">{errors[`hero.highlights.${idx}.title`]}</HelperText>
                        ) : null}
                      </div>

                      <div>
                        <div className="text-xs font-medium mb-1">Subtitle</div>
                        <Input
                          value={h?.subtitle ?? ""}
                          onChange={(e) => setArrayItem("hero.highlights", idx, { ...(h ?? {}), subtitle: e.target.value })}
                          placeholder="Systems"
                        />
                        {errors[`hero.highlights.${idx}.subtitle`] ? (
                          <HelperText tone="error">{errors[`hero.highlights.${idx}.subtitle`]}</HelperText>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors["hero.highlights"] ? <HelperText tone="error">{errors["hero.highlights"]}</HelperText> : null}
            </div>

            <div>
              <SectionHeader title="Primary button" desc="Label + href (e.g. #services)" />
              <div className="mt-2 grid grid-cols-1 gap-3">
                <div>
                  <div className="text-xs font-medium mb-1">Label</div>
                  <Input value={draft?.hero?.buttons?.primary?.label ?? ""} onChange={(e) => setByPath("hero.buttons.primary.label", e.target.value)} />
                </div>
                <div>
                  <div className="text-xs font-medium mb-1">Href</div>
                  <Input value={draft?.hero?.buttons?.primary?.href ?? ""} onChange={(e) => setByPath("hero.buttons.primary.href", e.target.value)} placeholder="#services" />
                  {errors["hero.buttons.primary.href"] ? <HelperText tone="error">{errors["hero.buttons.primary.href"]}</HelperText> : null}
                </div>
              </div>
            </div>

            <div>
              <SectionHeader title="Secondary button" desc="Label + href (e.g. #projects)" />
              <div className="mt-2 grid grid-cols-1 gap-3">
                <div>
                  <div className="text-xs font-medium mb-1">Label</div>
                  <Input value={draft?.hero?.buttons?.secondary?.label ?? ""} onChange={(e) => setByPath("hero.buttons.secondary.label", e.target.value)} />
                </div>
                <div>
                  <div className="text-xs font-medium mb-1">Href</div>
                  <Input value={draft?.hero?.buttons?.secondary?.href ?? ""} onChange={(e) => setByPath("hero.buttons.secondary.href", e.target.value)} placeholder="#projects" />
                  {errors["hero.buttons.secondary.href"] ? <HelperText tone="error">{errors["hero.buttons.secondary.href"]}</HelperText> : null}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="About" subtitle="Title, paragraphs, tags.">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium mb-1">Title</div>
              <Input value={draft?.about?.title ?? ""} onChange={(e) => setByPath("about.title", e.target.value)} />
              {errors["about.title"] ? <HelperText tone="error">{errors["about.title"]}</HelperText> : null}
            </div>
            <div>
              <div className="text-xs font-medium mb-1">Tags (comma separated)</div>
              <Input
                value={(Array.isArray(draft?.about?.tags) ? draft.about.tags.join(", ") : (draft?.about?.tags ?? ""))}
                onChange={(e) => setByPath("about.tags", e.target.value)}
                placeholder="React, Tailwind, Framer Motion"
              />
            </div>

            <div className="md:col-span-2">
              <div className="text-xs font-medium mb-2">Paragraphs</div>
              <div className="space-y-3">
                {(draft?.about?.paragraphs ?? []).map((p, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Textarea
                      rows={3}
                      value={p}
                      onChange={(e) => setArrayItem("about.paragraphs", idx, e.target.value)}
                    />
                    <Button variant="ghost" type="button" onClick={() => removeFromArray("about.paragraphs", idx)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button variant="outline" type="button" onClick={() => addToArray("about.paragraphs", "")}>
                  + Add paragraph
                </Button>
                {errors["about.paragraphs"] ? <HelperText tone="error">{errors["about.paragraphs"]}</HelperText> : null}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Contact" subtitle="Email + copy.">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium mb-1">Title</div>
              <Input value={draft?.contact?.title ?? ""} onChange={(e) => setByPath("contact.title", e.target.value)} />
            </div>
            <div>
              <div className="text-xs font-medium mb-1">Email</div>
              <Input value={draft?.contact?.email ?? ""} onChange={(e) => setByPath("contact.email", e.target.value)} placeholder="you@domain.com" />
              {errors["contact.email"] ? <HelperText tone="error">{errors["contact.email"]}</HelperText> : null}
            </div>
            <div className="md:col-span-2">
              <div className="text-xs font-medium mb-1">Description</div>
              <Textarea rows={4} value={draft?.contact?.description ?? ""} onChange={(e) => setByPath("contact.description", e.target.value)} />
            </div>
            <div>
              <div className="text-xs font-medium mb-1">Email button label</div>
              <Input value={draft?.contact?.emailButtonLabel ?? ""} onChange={(e) => setByPath("contact.emailButtonLabel", e.target.value)} />
            </div>
            <div>
              <div className="text-xs font-medium mb-1">Resume button label</div>
              <Input value={draft?.contact?.resumeButtonLabel ?? ""} onChange={(e) => setByPath("contact.resumeButtonLabel", e.target.value)} />
            </div>
          </div>
        </Card>

        <Card title="Services & How I Work" subtitle="Basic editing. (Advanced cards editing is available below)">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium mb-1">Services section title</div>
              <Input value={draft?.services?.sectionTitle ?? ""} onChange={(e) => setByPath("services.sectionTitle", e.target.value)} />
              {errors["services.sectionTitle"] ? <HelperText tone="error">{errors["services.sectionTitle"]}</HelperText> : null}
            </div>
            <div>
              <div className="text-xs font-medium mb-1">Services CTA label</div>
              <Input value={draft?.services?.ctaLabel ?? ""} onChange={(e) => setByPath("services.ctaLabel", e.target.value)} />
            </div>

            <div>
              <div className="text-xs font-medium mb-1">How I Work title</div>
              <Input value={draft?.howIWork?.title ?? ""} onChange={(e) => setByPath("howIWork.title", e.target.value)} />
              {errors["howIWork.title"] ? <HelperText tone="error">{errors["howIWork.title"]}</HelperText> : null}
            </div>
            <div>
              <div className="text-xs font-medium mb-1">How I Work intro</div>
              <Input value={draft?.howIWork?.intro ?? ""} onChange={(e) => setByPath("howIWork.intro", e.target.value)} />
            </div>
          </div>
        </Card>

        <Card title="Services cards" subtitle="Edit titles + bullet points.">
          <div className="space-y-4">
            {(draft?.services?.cards ?? []).map((c, idx) => (
              <div key={idx} className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">Card {idx + 1}</div>
                  <Button variant="ghost" type="button" onClick={() => removeFromArray("services.cards", idx)}>
                    Remove
                  </Button>
                </div>
                <div className="mt-3 grid md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium mb-1">Title</div>
                    <Input
                      value={c?.title ?? ""}
                      onChange={(e) => {
                        setDraft((prev) => {
                          const next = deepClone(prev);
                          next.services.cards[idx].title = e.target.value;
                          return next;
                        });
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1">Points (one per line)</div>
                    <Textarea
                      rows={4}
                      value={(c?.points ?? []).join("\n")}
                      onChange={(e) => {
                        const points = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
                        setDraft((prev) => {
                          const next = deepClone(prev);
                          next.services.cards[idx].points = points;
                          return next;
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              type="button"
              onClick={() => addToArray("services.cards", { title: "New Service", points: ["Point 1", "Point 2"] })}
            >
              + Add service card
            </Button>
          </div>
        </Card>

        <Card title="How the process works" subtitle="Edit the step cards shown under Services.">
          <div className="space-y-4">
            {(draft?.services?.processSteps ?? []).map((step, idx) => (
              <div key={idx} className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">Step {idx + 1}</div>
                  <Button variant="ghost" type="button" onClick={() => removeFromArray("services.processSteps", idx)}>
                    Remove
                  </Button>
                </div>
                <div className="mt-3 grid md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium mb-1">Title</div>
                    <Input
                      value={step?.title ?? ""}
                      onChange={(e) => {
                        setDraft((prev) => {
                          const next = deepClone(prev);
                          next.services.processSteps[idx].title = e.target.value;
                          return next;
                        });
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1">Description</div>
                    <Input
                      value={step?.desc ?? ""}
                      onChange={(e) => {
                        setDraft((prev) => {
                          const next = deepClone(prev);
                          next.services.processSteps[idx].desc = e.target.value;
                          return next;
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              type="button"
              onClick={() => addToArray("services.processSteps", { title: "New step", desc: "Describe the step" })}
            >
              + Add process step
            </Button>
          </div>
        </Card>

        <Card title="How I Work bullet points" subtitle="Shown in the How I Work section.">
          <div>
            <div className="text-xs font-medium mb-1">Points (one per line)</div>
            <Textarea
              rows={6}
              value={(draft?.howIWork?.points ?? []).join("\n")}
              onChange={(e) => {
                const points = e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean);
                setByPath("howIWork.points", points);
              }}
              placeholder="Build mobile-first, responsive layouts\nWrite reusable React components\n..."
            />
          </div>
        </Card>

        <Card title="About proof cards" subtitle="These are the 3 proof cards under the About section (not Projects).">
          <div className="space-y-4">
            {(draft?.about?.proofBlocks ?? []).map((b, idx) => (
              <div key={idx} className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">Proof card {idx + 1}</div>
                  <Button variant="ghost" type="button" onClick={() => removeFromArray("about.proofBlocks", idx)}>
                    Remove
                  </Button>
                </div>
                <div className="mt-3 grid md:grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs font-medium mb-1">Title</div>
                    <Input value={b?.title ?? ""} onChange={(e) => setArrayItem("about.proofBlocks", idx, { ...b, title: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-xs font-medium mb-1">Description</div>
                    <Input value={b?.desc ?? ""} onChange={(e) => setArrayItem("about.proofBlocks", idx, { ...b, desc: e.target.value })} />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1">Icon</div>

                    {/* Custom icon (Cloudinary) overrides iconKey */}
                    {b?.iconUrl ? (
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 px-3 py-2">
                        <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                          <img src={b.iconUrl} alt="" className="w-6 h-6 object-contain" loading="lazy" />
                          <span className="truncate">Custom icon</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setArrayItem("about.proofBlocks", idx, { ...b, iconUrl: "" })}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <select
                          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40"
                          value={b?.iconKey ?? "ui"}
                          onChange={(e) => setArrayItem("about.proofBlocks", idx, { ...b, iconKey: e.target.value })}
                        >
                          {PROOF_ICON_KEYS.map((k) => (
                            <option key={k} value={k}>
                              {k}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 px-3 py-2">
                          {/* Preview matches the About section icon set */}
                          <span className="shrink-0 text-slate-700 dark:text-slate-200">
                            {{
                              ui: (
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M4 7h16M4 12h16M4 17h10" />
                                </svg>
                              ),
                              dashboard: (
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M4 4h16v6H4zM4 14h7v6H4zM13 14h7v6h-7z" />
                                </svg>
                              ),
                              rocket: (
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M14 4c4 1 6 4 6 8-4 0-7 2-8 6-2 0-5-2-6-6 4 0 7-2 8-8z" />
                                  <path d="M9 15l-2 2" />
                                </svg>
                              ),
                              shield: (
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" />
                                </svg>
                              ),
                              zap: (
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M13 2L3 14h8l-1 8 11-14h-8l1-6z" />
                                </svg>
                              ),
                              sparkles: (
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 2l3 7h7l-5.5 4.3L18.5 21 12 16.8 5.5 21l2-7.7L2 9h7z" />
                                </svg>
                              ),
                              code: (
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M8 9l-3 3 3 3" />
                                  <path d="M16 9l3 3-3 3" />
                                  <path d="M14 6l-4 12" />
                                </svg>
                              ),
                              globe: (
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M2 12h20" />
                                  <path d="M12 2a15 15 0 0 1 0 20" />
                                  <path d="M12 2a15 15 0 0 0 0 20" />
                                </svg>
                              ),
                              wand: (
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M4 20l9-9" />
                                  <path d="M14 11l6-6" />
                                  <path d="M15 5l4 4" />
                                  <path d="M9 3l1 2" />
                                  <path d="M3 9l2 1" />
                                  <path d="M21 15l-2-1" />
                                  <path d="M15 21l-1-2" />
                                </svg>
                              ),
                            }[b?.iconKey ?? "ui"]}
                          </span>
                          <span className="text-xs text-slate-600 dark:text-slate-300">Preview</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-2">
                      <CloudinaryUpload
                        folder="portfolio/proof-icons"
                        allowedFormats={["png", "jpg", "jpeg", "webp", "svg"]}
                        resourceType="image"
                        onUploaded={(url) => setArrayItem("about.proofBlocks", idx, { ...b, iconUrl: url })}
                      />
                      <HelperText>Optional: upload a custom icon (overrides the dropdown).</HelperText>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              type="button"
              onClick={() => addToArray("about.proofBlocks", { title: "New proof", desc: "Short supporting line", iconKey: "ui" })}
            >
              + Add proof card
            </Button>

            {!(draft?.about?.proofBlocks ?? []).length ? (
              <HelperText>
                If this list is empty, the About section will fall back to the built-in default proof cards.
                Add 3 items here to fully control them from the admin.
              </HelperText>
            ) : null}
          </div>
        </Card>

        <Card title="Toolbox section" subtitle="Edit the Toolbox section content.">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium mb-1">Pill label</div>
              <Input value={draft?.toolbox?.pill ?? ""} onChange={(e) => setByPath("toolbox.pill", e.target.value)} />
            </div>
            <div>
              <div className="text-xs font-medium mb-1">Title</div>
              <Input value={draft?.toolbox?.title ?? ""} onChange={(e) => setByPath("toolbox.title", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <div className="text-xs font-medium mb-1">Intro</div>
              <Textarea rows={3} value={draft?.toolbox?.intro ?? ""} onChange={(e) => setByPath("toolbox.intro", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <div className="text-xs font-medium mb-1">Chips (comma separated)</div>
              <Input
                value={Array.isArray(draft?.toolbox?.chips) ? draft.toolbox.chips.join(", ") : ""}
                onChange={(e) => {
                  const chips = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                  setByPath("toolbox.chips", chips);
                }}
                placeholder="UI, Motion, Backend"
              />
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {(draft?.toolbox?.items ?? []).map((it, idx) => (
              <div key={idx} className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">Item {idx + 1}</div>
                  <Button variant="ghost" type="button" onClick={() => removeFromArray("toolbox.items", idx)}>
                    Remove
                  </Button>
                </div>
                <div className="mt-3 grid md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium mb-1">Name</div>
                    <Input
                      value={it?.name ?? ""}
                      onChange={(e) => {
                        setDraft((prev) => {
                          const next = deepClone(prev);
                          next.toolbox.items[idx].name = e.target.value;
                          return next;
                        });
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1">Hint</div>
                    <Input
                      value={it?.hint ?? ""}
                      onChange={(e) => {
                        setDraft((prev) => {
                          const next = deepClone(prev);
                          next.toolbox.items[idx].hint = e.target.value;
                          return next;
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              type="button"
              onClick={() => addToArray("toolbox.items", { name: "New tool", hint: "Category" })}
            >
              + Add toolbox item
            </Button>
          </div>
        </Card>

        <HelperText>
          Note: advanced sections like <span className="font-mono">contact.quoteBoxItems</span> are kept but not shown here to keep the UI simple.
          They will remain unchanged unless you edit them in code.
        </HelperText>
      </div>
    </PageFade>
  );
}
