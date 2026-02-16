import { useEffect, useMemo, useState } from "react";
import { siteContent, subscribeContent } from "../../content";
import { saveSiteContent } from "../../firebase/contentSync";
import { deepClone, deepEqual } from "../utils/deep";
import { Button, Card, HelperText, Input, PageFade, Select, Textarea } from "../components/UI";
import CloudinaryUpload from "../components/CloudinaryUpload";
import { normalizeTags, safeStringArray, validateSite } from "../utils/validate";

const PROOF_ICON_OPTIONS = [
  { value: "ui", label: "UI / Motion" },
  { value: "dashboard", label: "Dashboard" },
  { value: "rocket", label: "Rocket" },
  { value: "shield", label: "Shield" },
  { value: "zap", label: "Zap" },
  { value: "code", label: "Code" },
  { value: "globe", label: "Globe" },
  { value: "sparkles", label: "Sparkles" },

];

const PROOF_ICON_PREVIEWS = {
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
      <path d="M14 10l-3 3" />
      <path d="M5 20l3-3" />
      <path d="M9 15l-4 1 1-4 9-9a4 4 0 015 5z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6z" />
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h8l-1 8 10-12h-8z" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 18l6-6-6-6" />
      <path d="M8 6l-6 6 6 6" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22a10 10 0 100-20 10 10 0 000 20z" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 010 20" />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
      <path d="M19 14l.8 2.4L22 17l-2.2.6L19 20l-.8-2.4L16 17l2.2-.6L19 14z" />
    </svg>
  ),
};


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
              <div className="text-xs font-medium mb-1">Intro</div>
              <Textarea rows={3} value={draft?.hero?.intro ?? ""} onChange={(e) => setByPath("hero.intro", e.target.value)} />
              {errors["hero.intro"] ? <HelperText tone="error">{errors["hero.intro"]}</HelperText> : null}
            </div>

            <div className="md:col-span-2">
              <div className="text-xs font-medium mb-1">Profile photo URL</div>
              <Input
                value={draft?.hero?.photoUrl ?? ""}
                onChange={(e) => setByPath("hero.photoUrl", e.target.value)}
                placeholder="https://... or /uploads/profile.jpg"
              />
              {errors["hero.photoUrl"] ? <HelperText tone="error">{errors["hero.photoUrl"]}</HelperText> : null}

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5">
                  {draft?.hero?.photoUrl ? (
                    <img src={draft.hero.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-[10px] text-slate-500 dark:text-slate-300">No photo</div>
                  )}
                </div>
                <CloudinaryUpload folder="portfolio/site" onUploaded={(url) => setByPath("hero.photoUrl", url)} />
              </div>
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
        
            <div className="md:col-span-2 mt-2">
              <div className="text-xs font-medium mb-2">Proof Cards (About)</div>
              <HelperText>These cards appear under About. Edit titles and descriptions (icons stay consistent).</HelperText>
              <div className="grid md:grid-cols-3 gap-3 mt-3">
                {(Array.isArray(draft?.about?.proofBlocks) ? draft.about.proofBlocks : []).map((card, idx) => (
                  <div key={idx} className="rounded-xl border border-black/5 dark:border-white/10 p-3 bg-white/60 dark:bg-white/5">
                    <div className="text-[11px] font-medium mb-1">Card {idx + 1} Title</div>
                    <Input value={card?.title ?? ""} onChange={(e) => setByPath(`about.proofBlocks.${idx}.title`, e.target.value)} />

                    <div className="text-[11px] font-medium mt-3 mb-2">Icon</div>
                    <div className="grid grid-cols-4 gap-2">
                      {PROOF_ICON_OPTIONS.map((opt) => {
                        const selected = (card?.iconKey ?? "sparkles") === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setByPath(`about.proofBlocks.${idx}.iconKey`, opt.value)}
                            className={`rounded-lg border px-2 py-2 text-left transition ${
                              selected
                                ? "border-slate-900/60 bg-slate-900/5 dark:border-white/40 dark:bg-white/10"
                                : "border-black/10 bg-white/40 hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                            }`}
                            aria-pressed={selected}
                            title={opt.label}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-slate-700 dark:text-slate-200">
                                {PROOF_ICON_PREVIEWS[opt.value] ?? PROOF_ICON_PREVIEWS.sparkles}
                              </span>
                              <span className="text-[11px] text-slate-700 dark:text-slate-200">{opt.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-[11px] font-medium mt-3 mb-1">Description</div>
                    <Textarea rows={3} value={card?.desc ?? ""} onChange={(e) => setByPath(`about.proofBlocks.${idx}.desc`, e.target.value)} />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    const cur = Array.isArray(draft?.about?.proofBlocks) ? draft.about.proofBlocks : [];
                    setByPath("about.proofBlocks", [...cur, { title: "New card", desc: "Describe the proof.", iconKey: "sparkles" }]);
                  }}
                >
                  + Add card
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const cur = Array.isArray(draft?.about?.proofBlocks) ? draft.about.proofBlocks : [];
                    setByPath("about.proofBlocks", cur.slice(0, Math.max(0, cur.length - 1)));
                  }}
                >
                  − Remove last
                </Button>
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

        <HelperText>
          Note: advanced sections like <span className="font-mono">services.processSteps</span> and <span className="font-mono">contact.quoteBoxItems</span> are kept but not shown here to keep the UI simple.
          They will remain unchanged unless you edit them in code.
        </HelperText>
      </div>
    </PageFade>
  );
}
