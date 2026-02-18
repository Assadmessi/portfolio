import { useEffect, useMemo, useState } from "react";
import { siteContent, subscribeContent } from "../../content";
import { saveSiteContent } from "../../firebase/contentSync";
import { deepClone, deepEqual } from "../utils/deep";
import { Button, Card, HelperText, Input, PageFade, Textarea } from "../components/UI";
import StorageUpload from "../components/StorageUpload";
import { normalizeTags, safeStringArray, validateSite } from "../utils/validate";

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

const PROOF_ICON_PRESETS = {
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
      <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" />
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h8l-1 8 11-14h-8z" />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
      <path d="M4 16l.75 2.25L7 19l-2.25.75L4 22l-.75-2.25L1 19l2.25-.75L4 16z" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 9l-3 3 3 3" />
      <path d="M16 9l3 3-3 3" />
      <path d="M14 4l-4 16" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2c3 3 3 17 0 20" />
    </svg>
  ),
  wand: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 4l5 5" />
      <path d="M4 15l5 5" />
      <path d="M7 12l10-10" />
      <path d="M3 21l6-6" />
    </svg>
  ),
};



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

    // proof cards
    nextDraft.about.proofBlocks = Array.isArray(nextDraft.about.proofBlocks) ? nextDraft.about.proofBlocks : [];
    nextDraft.about.proofBlocks = nextDraft.about.proofBlocks
      .map((x) => ({
        title: String(x?.title ?? "").trim(),
        desc: String(x?.desc ?? "").trim(),
        iconKey: String(x?.iconKey ?? "").trim(),
        iconImage: String(x?.iconImage ?? "").trim(),
      }))
      .filter((x) => x.title && x.desc);

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

        <Card title="About Proof Cards" subtitle="Edit the 3 proof cards shown under About. Keep text the same; just choose an icon preset or upload an icon image.">
          <div className="space-y-4">
            <HelperText>
              Tip: Use <b>Icon preset</b> for clean SVGs, or set <b>Icon image URL</b> (you can upload using the button).
              If Icon image URL is set, it will override the preset.
            </HelperText>

            {(draft?.about?.proofBlocks ?? []).map((item, idx) => {
              const iconKey = item?.iconKey || "ui";
              const iconPreview = PROOF_ICON_PRESETS[iconKey] ?? PROOF_ICON_PRESETS.ui;

              return (
                <div key={idx} className="rounded-2xl border border-black/5 dark:border-white/10 p-4 bg-white/60 dark:bg-white/5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/15 flex items-center justify-center">
                        {item?.iconImage ? (
                          <img src={item.iconImage} alt="" className="w-5 h-5 object-contain" loading="lazy" />
                        ) : (
                          iconPreview
                        )}
                      </div>
                      <div className="text-sm font-semibold">Proof Card #{idx + 1}</div>
                    </div>
                    <Button variant="ghost" type="button" onClick={() => removeFromArray("about.proofBlocks", idx)}>
                      Remove
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="text-xs font-medium mb-1">Title</div>
                      <Input value={item?.title ?? ""} onChange={(e) => setArrayItem("about.proofBlocks", idx, { ...item, title: e.target.value })} />
                    </div>

                    <div>
                      <div className="text-xs font-medium mb-1">Icon preset</div>
                      <select
                        value={iconKey}
                        onChange={(e) => setArrayItem("about.proofBlocks", idx, { ...item, iconKey: e.target.value })}
                        className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm"
                      >
                        {Object.keys(PROOF_ICON_PRESETS).map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                      <HelperText>Choose an icon preset (SVG). Looks clean on every device.</HelperText>
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-xs font-medium mb-1">Description</div>
                      <Textarea rows={3} value={item?.desc ?? ""} onChange={(e) => setArrayItem("about.proofBlocks", idx, { ...item, desc: e.target.value })} />
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-xs font-medium mb-1">Icon image URL (optional)</div>
                      <Input
                        value={item?.iconImage ?? ""}
                        onChange={(e) => setArrayItem("about.proofBlocks", idx, { ...item, iconImage: e.target.value })}
                        placeholder="https://.../icon.png"
                      />
                      <div className="mt-3">
                        <StorageUpload
                          folder="portfolio/proof-icons"
                          onUploaded={(url) => setArrayItem("about.proofBlocks", idx, { ...item, iconImage: url })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <Button
              variant="outline"
              type="button"
              onClick={() =>
                addToArray("about.proofBlocks", { title: "New proof", desc: "Describe it.", iconKey: "ui", iconImage: "" })
              }
            >
              + Add proof card
            </Button>

            <HelperText>
              If you keep exactly 3 cards, the layout stays perfect. More than 3 will wrap automatically.
            </HelperText>
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
